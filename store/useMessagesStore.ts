import { create } from 'zustand';
import { createClient } from '@/utils/supabase/client';
import {
    getConversationById,
    getConversationsForUser,
    getPeerReadMarkers,
    getUnreadCounts,
    otherParticipantId,
} from '@/lib/messagesData';
import { fetchProfilesByIds } from '@/lib/userData';
import type { Conversation } from '@/types/messages';
import type { ProfileType } from '@/types/user';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export interface ConversationWithProfile {
    conversation: Conversation;
    otherProfile: ProfileType | null;
}

interface MessagesState {
    conversations: ConversationWithProfile[];
    // Unread messages per conversation (Sprint 150); absent = 0.
    unreadCounts: Record<string, number>;
    // The other participant's read marker per conversation -- ticks on my
    // last message in the list.
    peerReadMarkers: Record<string, string>;
    loading: boolean;
    refresh: (userId: string) => Promise<void>;
    markRead: (conversationId: string) => void;
    removeConversation: (conversationId: string) => void;
    subscribeToRealtime: (userId: string) => void;
}

// Unread messages across all conversations -- the Messages badge.
export function selectUnreadCount(unreadCounts: Record<string, number>): number {
    return Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);
}

// Conversations, unread counts and peer read markers in one go -- what
// both the first load and the quiet background refresh need.
async function fetchListState(userId: string) {
    const [conversations, unreadCounts, peerReadMarkers] = await Promise.all([
        fetchConversationsWithProfiles(userId),
        getUnreadCounts(),
        getPeerReadMarkers(userId),
    ]);
    return { conversations, unreadCounts, peerReadMarkers };
}

async function fetchConversationsWithProfiles(userId: string): Promise<ConversationWithProfile[]> {
    const conversations = await getConversationsForUser(userId);
    const otherIds = [...new Set(conversations.map((c) => otherParticipantId(c, userId)))];
    const profilesById = await fetchProfilesByIds(otherIds);
    return conversations.map((conversation) => ({
        conversation,
        otherProfile: profilesById[otherParticipantId(conversation, userId)] ?? null,
    }));
}

export const useMessagesStore = create<MessagesState>((set, get) => ({
    conversations: [],
    unreadCounts: {},
    peerReadMarkers: {},
    loading: true,

    refresh: async (userId) => {
        set({ loading: true });
        set({ ...(await fetchListState(userId)), loading: false });
    },

    // Local only -- the chat thread already awaited the real
    // `markConversationRead` write before calling this; re-deriving the
    // badge from a full refetch here would just add a flash of stale state.
    markRead: (conversationId) => {
        const { [conversationId]: _cleared, ...rest } = get().unreadCounts;
        void _cleared;
        set({ unreadCounts: rest });
    },

    // Local removal right after this user deleted/cleared a chat -- the
    // realtime refetch would get there too, this just avoids the lag.
    removeConversation: (conversationId) => {
        set({
            conversations: get().conversations.filter((entry) => entry.conversation.id !== conversationId),
        });
    },

    subscribeToRealtime: (userId) => {
        const supabase = createClient();

        get().refresh(userId);

        // Unfiltered, same reasoning as useFriendRequestStore.ts's own
        // channel: `messages` SELECT RLS already scopes rows to each
        // user's own conversations, and Realtime enforces that same
        // policy against the subscriber's JWT, so an unfiltered INSERT
        // stream here only ever delivers messages from conversations
        // this user is actually part of.
        const channel = supabase
            .channel(`messages:${userId}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages' },
                (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
                    applyIncomingMessage(userId, payload);
                }
            )
            // Deletes: "delete for everyone" fires an UPDATE here (the
            // trigger recomputing last_message_*), a chat deleted for both
            // fires a DELETE (id only, unfilterable -- matched locally).
            // A quiet refetch of the per-user previews view is the one
            // correct source; a local patch can't know this user's newest
            // visible message. Same as mobile's messages-store.ts.
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'conversations' },
                () => scheduleQuietRefresh(userId)
            )
            // Read markers (Sprint 150): the other participant's turns my
            // ticks double; my own (another tab/device) re-derives counts.
            // RLS limits these to my conversations' participants.
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'conversation_reads' },
                (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
                    const row = payload.new as { conversation_id?: string; user_id?: string; last_read_at?: string };
                    if (!row.conversation_id || !row.last_read_at) return;
                    if (row.user_id === userId) {
                        scheduleQuietRefresh(userId);
                        return;
                    }
                    set({ peerReadMarkers: { ...get().peerReadMarkers, [row.conversation_id]: row.last_read_at } });
                }
            )
            .on(
                'postgres_changes',
                { event: 'DELETE', schema: 'public', table: 'conversations' },
                (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
                    const deletedId = (payload.old as { id?: string }).id;
                    if (deletedId) get().removeConversation(deletedId);
                }
            )
            .subscribe();

        return () => {
            if (quietRefreshTimer) clearTimeout(quietRefreshTimer);
            supabase.removeChannel(channel);
        };
    },
}));

// Every send also UPDATEs `conversations` (the last_message_* trigger), so
// these arrive in bursts -- debounced, and without flipping `loading` (no
// skeleton flash for a background refresh).
let quietRefreshTimer: ReturnType<typeof setTimeout> | null = null;
function scheduleQuietRefresh(userId: string): void {
    if (quietRefreshTimer) clearTimeout(quietRefreshTimer);
    quietRefreshTimer = setTimeout(async () => {
        quietRefreshTimer = null;
        useMessagesStore.setState({ ...(await fetchListState(userId)), loading: false });
    }, 400);
}

// Patches the one affected conversation's preview fields in place and
// re-sorts by `last_message_at`, rather than refetching the whole list on
// every single incoming message. The one case a local patch can't handle
// -- a brand new conversation someone else just started with this user,
// not yet in `conversations` at all -- falls back to fetching that one row.
async function applyIncomingMessage(
    currentUserId: string,
    payload: RealtimePostgresChangesPayload<Record<string, unknown>>
): Promise<void> {
    const row = payload.new as Record<string, unknown>;
    const conversationId = row.conversation_id;
    const senderId = row.sender_id;
    const body = row.body;
    const createdAt = row.created_at;
    if (
        typeof conversationId !== 'string' ||
        typeof senderId !== 'string' ||
        typeof body !== 'string' ||
        typeof createdAt !== 'string'
    ) {
        return;
    }

    // Someone else's message: one more unread. The open thread (if it's
    // this one) marks it read right after, which zeroes it again.
    if (senderId !== currentUserId) {
        const { unreadCounts } = useMessagesStore.getState();
        useMessagesStore.setState({
            unreadCounts: { ...unreadCounts, [conversationId]: (unreadCounts[conversationId] ?? 0) + 1 },
        });
    }

    const { conversations } = useMessagesStore.getState();
    const existingIndex = conversations.findIndex((entry) => entry.conversation.id === conversationId);

    if (existingIndex === -1) {
        const conversation = await getConversationById(conversationId);
        if (!conversation) return;
        const otherId = otherParticipantId(conversation, currentUserId);
        const profilesById = await fetchProfilesByIds([otherId]);

        const { conversations: latest } = useMessagesStore.getState();
        if (latest.some((entry) => entry.conversation.id === conversationId)) return;
        useMessagesStore.setState({
            conversations: [{ conversation, otherProfile: profilesById[otherId] ?? null }, ...latest],
        });
        return;
    }

    const updatedEntry: ConversationWithProfile = {
        ...conversations[existingIndex],
        conversation: {
            ...conversations[existingIndex].conversation,
            last_message_at: createdAt,
            last_message_body: body,
            last_message_sender_id: senderId,
        },
    };
    const next = [updatedEntry, ...conversations.filter((_, i) => i !== existingIndex)];
    useMessagesStore.setState({ conversations: next });
}
