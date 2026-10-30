import { createClient } from '@/utils/supabase/client';
import { Conversation, Message } from '@/types/messages';

/**
 * All direct Supabase calls against `conversations`/`messages`/
 * `conversation_reads` live here -- mirrors the mobile app's own
 * `src/lib/supabase/messages.ts` exactly (same table/column shapes, same
 * `getOrCreateConversation` canonical-pair-ordering logic -- this MUST
 * match mobile's sort behavior, or the two platforms could create two
 * separate conversation rows for the same pair of users). Beta scope:
 * 1-on-1 only, any user can message any other user, text only, no read
 * receipts visible to the other participant (see `conversation_reads`'
 * own RLS in the migration -- a personal unread-badge marker, not a
 * shared "seen" feature).
 *
 * Follows this repo's own established lib convention (friendData.ts,
 * userData.ts): swallow the Supabase error, console.error it, and return
 * a safe fallback value -- not throw.
 */

const CONVERSATION_COLUMNS =
    'id, user_a, user_b, last_message_at, last_message_body, last_message_sender_id, created_at';
const MESSAGE_COLUMNS = 'id, conversation_id, sender_id, body, created_at, edited_at';

export function otherParticipantId(conversation: Conversation, userId: string): string {
    return conversation.user_a === userId ? conversation.user_b : conversation.user_a;
}

// Reads `conversation_previews` (same columns as `conversations`), not the
// table: its last_message_* is the newest message *this user* can still
// see after "delete for me"/"delete chat for me", and it leaves out chats
// this user cleared until something newer arrives. See mobile repo's
// 20261029090000_add_message_deletion.sql.
export async function getConversationsForUser(userId: string): Promise<Conversation[]> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('conversation_previews')
        .select(CONVERSATION_COLUMNS)
        .or(`user_a.eq.${userId},user_b.eq.${userId}`)
        .order('last_message_at', { ascending: false, nullsFirst: false });

    if (error) {
        console.error('Error fetching conversations:', error);
        return [];
    }
    return data ?? [];
}

export async function getConversationById(id: string): Promise<Conversation | null> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('conversations')
        .select(CONVERSATION_COLUMNS)
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching conversation:', error);
        return null;
    }
    return data ?? null;
}

// Finds the existing 1-on-1 conversation between the two users, or
// creates one. `user_a`/`user_b` are stored in a canonical
// (lexicographically sorted) order -- a unique constraint on the sorted
// pair means two near-simultaneous calls can never create a duplicate
// row, but this still checks first rather than relying on a race into a
// constraint-violation catch.
export async function getOrCreateConversation(
    userId: string,
    otherUserId: string
): Promise<Conversation | null> {
    const supabase = createClient();
    const [userA, userB] = [userId, otherUserId].sort();

    const { data: existing, error: selectError } = await supabase
        .from('conversations')
        .select(CONVERSATION_COLUMNS)
        .eq('user_a', userA)
        .eq('user_b', userB)
        .maybeSingle();

    if (selectError) {
        console.error('Error looking up conversation:', selectError);
        return null;
    }
    if (existing) return existing;

    const { data: created, error: insertError } = await supabase
        .from('conversations')
        .insert({ user_a: userA, user_b: userB })
        .select(CONVERSATION_COLUMNS)
        .single();

    if (insertError) {
        console.error('Error creating conversation:', insertError);
        return null;
    }
    return created ?? null;
}

export const MESSAGES_PAGE_SIZE = 30;

// Newest-first page, matching the chat thread's "load older on scroll up"
// pagination. Pass `before` (an already-loaded message's `created_at`) to
// load an older page; omit it for the initial/latest page.
export async function getMessages(conversationId: string, before?: string): Promise<Message[]> {
    const supabase = createClient();
    let query = supabase
        .from('messages')
        .select(MESSAGE_COLUMNS)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: false })
        .limit(MESSAGES_PAGE_SIZE);
    if (before) query = query.lt('created_at', before);

    const { data, error } = await query;
    if (error) {
        console.error('Error fetching messages:', error);
        return [];
    }
    return data ?? [];
}

export async function sendMessage(
    conversationId: string,
    senderId: string,
    body: string
): Promise<Message | null> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('messages')
        .insert({ conversation_id: conversationId, sender_id: senderId, body })
        .select(MESSAGE_COLUMNS)
        .single();

    if (error) {
        console.error('Error sending message:', error);
        return null;
    }
    return data ?? null;
}

// Personal "read up to here" marker for the unread badge -- never exposed
// to the other participant. Upserted when the chat thread is opened, not
// per incoming message while it's open.
export async function markConversationRead(conversationId: string, userId: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.from('conversation_reads').upsert(
        { conversation_id: conversationId, user_id: userId, last_read_at: new Date().toISOString() },
        { onConflict: 'conversation_id,user_id' }
    );
    if (error) console.error('Error marking conversation read:', error);
}

export async function getReadMarkers(userId: string): Promise<Record<string, string>> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('conversation_reads')
        .select('conversation_id, last_read_at')
        .eq('user_id', userId);

    if (error) {
        console.error('Error fetching read markers:', error);
        return {};
    }

    const markers: Record<string, string> = {};
    for (const row of data ?? []) {
        markers[row.conversation_id as string] = row.last_read_at as string;
    }
    return markers;
}

// "Delete for everyone" -- a real DELETE, sender-only (RLS). The other
// side's open thread drops it via the realtime DELETE event; a trigger
// recomputes the shared preview. Same four calls as mobile's messages.ts.
export async function deleteMessageForEveryone(messageId: string): Promise<boolean> {
    const supabase = createClient();
    const { error } = await supabase.from('messages').delete().eq('id', messageId);
    if (error) console.error('Error deleting message:', error);
    return !error;
}

// Edits the text of one of this user's own messages -- RLS + column grants
// allow only `body`, only for the sender; the DB stamps `edited_at` and
// refreshes the conversation preview. The other side gets the realtime
// UPDATE. Same call as mobile's messages.ts `editMessage`.
export async function editMessage(messageId: string, body: string): Promise<Message | null> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('messages')
        .update({ body })
        .eq('id', messageId)
        .select(MESSAGE_COLUMNS)
        .single();
    if (error) {
        console.error('Error editing message:', error);
        return null;
    }
    return data as Message;
}

// "Delete for me" -- the messages SELECT policy then stops returning it to
// this user only.
export async function hideMessageForMe(messageId: string, userId: string): Promise<boolean> {
    const supabase = createClient();
    const { error } = await supabase
        .from('hidden_messages')
        .upsert({ message_id: messageId, user_id: userId }, { onConflict: 'message_id,user_id' });
    if (error) console.error('Error hiding message:', error);
    return !error;
}

// "Delete chat" without "also delete for <name>": clears this user's
// history up to now; the chat returns to their list with the next message.
export async function clearConversationForMe(conversationId: string, userId: string): Promise<boolean> {
    const supabase = createClient();
    const { error } = await supabase.from('conversation_clears').upsert(
        { conversation_id: conversationId, user_id: userId, cleared_at: new Date().toISOString() },
        { onConflict: 'conversation_id,user_id' }
    );
    if (error) console.error('Error clearing conversation:', error);
    return !error;
}

// "Delete chat" with "also delete for <name>": deletes the conversation,
// cascading to all its messages for both participants.
export async function deleteConversationForEveryone(conversationId: string): Promise<boolean> {
    const supabase = createClient();
    const { error } = await supabase.from('conversations').delete().eq('id', conversationId);
    if (error) console.error('Error deleting conversation:', error);
    return !error;
}
