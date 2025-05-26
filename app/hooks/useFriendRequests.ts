import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import {fetchIncomingFriendRequests} from "../../lib/friendData";
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import {FriendRecord} from "../../types/friends";

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

        const subscription = supabase
            .channel('incoming-requests')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'friends',
                    filter: `friend_id=eq.${currentUserId}`
                },
                (payload: RealtimePostgresChangesPayload<FriendRecord>) => {
                    const newRecord = payload.new as FriendRecord;
                    const oldRecord = payload.old as FriendRecord;


                    if (payload.eventType === 'INSERT' && newRecord?.status === 'pending') {
                        setRequests((prev) => [...prev, newRecord]);
                    } else if (payload.eventType === 'DELETE') {
                        setRequests((prev) => prev.filter(r => r.id !== oldRecord?.id));
                    } else if (payload.eventType === 'UPDATE') {
                        if (newRecord?.status !== 'pending') {
                            setRequests((prev) => prev.filter(r => r.id !== newRecord.id));
                        }
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [currentUserId]);

    return requests;
};
