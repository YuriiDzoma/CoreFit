import { create } from 'zustand';
import { createClient } from '@/utils/supabase/client';
import { fetchIncomingFriendRequests } from '@/lib/friendData';
import type { FriendRecord } from '@/types/friends';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

interface FriendRequestState {
    requests: FriendRecord[];
    setRequests: (requests: FriendRecord[]) => void;
    subscribeToRealtime: (userId: string) => void;
}

export const useFriendRequestStore = create<FriendRequestState>((set, get) => ({
    requests: [],

    setRequests: (requests) => set({ requests }),

    subscribeToRealtime: (userId) => {
        const supabase = createClient();

        const fetchInitial = async () => {
            const data = await fetchIncomingFriendRequests(userId);
            set({ requests: data });
        };

        fetchInitial();

        const subscription = supabase
            .channel('realtime-incoming-requests')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'friends',
                    filter: `friend_id=eq.${userId}`,
                },
                (payload: RealtimePostgresChangesPayload<FriendRecord>) => {
                    const { eventType, new: newRow, old: oldRow } = payload;
                    const current = get().requests;

                    if (eventType === 'INSERT' && newRow?.status === 'pending') {
                        if (!current.some((r) => r.id === newRow.id)) {
                            set({ requests: [...current, newRow] });
                        }
                    }

                    if (eventType === 'DELETE' && oldRow?.id) {
                        set({ requests: current.filter((r) => r.id !== oldRow.id) });
                    }

                    if (eventType === 'UPDATE' && newRow?.status !== 'pending') {
                        set({ requests: current.filter((r) => r.id !== newRow.id) });
                    }
                }
            )
            .subscribe();

        // optional unsubscribe cleanup
        return () => {
            supabase.removeChannel(subscription);
        };
    },
}));
