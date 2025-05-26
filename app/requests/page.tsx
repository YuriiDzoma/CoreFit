'use client';

import { useAppSelector } from '@/app/hooks/redux';
import { getText } from '@/store/selectors';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { ProfileType } from '@/types/user';
import {useFriendRequests} from "../hooks/useFriendRequests";

export default function Page() {
    const { base } = useAppSelector(getText);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [usersMap, setUsersMap] = useState<Record<string, ProfileType>>({});
    const requests = useFriendRequests(currentUserId);

    useEffect(() => {
        const init = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setCurrentUserId(user.id);

            const ids = requests.map(r => r.user_id);
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .in('id', ids);

            if (data) {
                const map = Object.fromEntries(data.map((u) => [u.id, u]));
                setUsersMap(map);
            }
        };
        init();
    }, [requests]);

    return (
        <div>
            <h2>Requests</h2>
            <ul>
                {requests.map((req) => {
                    const user = usersMap[req.user_id];
                    if (!user) return null;
                    return (
                        <li key={req.id}>
                            <img src={user.avatar_url} width={32} height={32} alt={user.username} />
                            <span>{user.username}</span>
                            {/* Тут будуть кнопки: Accept / Decline */}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
