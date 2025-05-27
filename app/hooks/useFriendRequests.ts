import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { fetchIncomingFriendRequests } from '@/lib/friendData';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { FriendRecord } from '@/types/friends';

export const useFriendRequests = (currentUserId: string | null) => {
    const [requests, setRequests] = useState<FriendRecord[]>([]);

    useEffect(() => {
        if (!currentUserId) return;

        const supabase = createClient();

        const fetchInitial = async () => {
            const data = await fetchIncomingFriendRequests(currentUserId);
            setRequests(data);
        };

        fetchInitial();
    }, [currentUserId]);

    const subscribeToChanges = (onNewUserId?: (userId: string) => void) => {
        if (!currentUserId) return () => {};

        const supabase = createClient();

        const subscription = supabase
            .channel('incoming-requests')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'friends',
                    filter: `friend_id=eq.${currentUserId}`,
                },
                (payload: RealtimePostgresChangesPayload<FriendRecord>) => {
                    console.log(payload)
                    const newRecord = payload.new as FriendRecord;
                    const oldRecord = payload.old as FriendRecord;

                    if (payload.eventType === 'INSERT' && newRecord?.status === 'pending') {
                        setRequests((prev) => {
                            const exists = prev.some((r) => r.id === newRecord.id);
                            return exists ? prev : [...prev, newRecord];
                        });
                        onNewUserId?.(newRecord.user_id);
                    }

                    if (payload.eventType === 'DELETE' && oldRecord?.id) {
                        setRequests((prev) => prev.filter((r) => r.id !== oldRecord.id));
                    }

                    if (payload.eventType === 'UPDATE' && newRecord?.status !== 'pending') {
                        setRequests((prev) => prev.filter((r) => r.id !== newRecord.id));
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    };

    return {
        requests,
        setRequests,
        subscribeToChanges,
    };
};
