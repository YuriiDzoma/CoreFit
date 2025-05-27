'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { getAllFriendsOfUser } from '@/lib/friendData';
import { ProfileType } from '@/types/user';
import styles from './profiles.module.scss';
import { getUserId } from '@/store/selectors';
import { useAppSelector } from '@/app/hooks/redux';

const Friends = () => {
    const userId = useAppSelector(getUserId);
    const [friends, setFriends] = useState<ProfileType[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!userId) return;

            const supabase = createClient();
            const records = await getAllFriendsOfUser(userId);

            const friendIds = records.map(r =>
                r.user_id === userId ? r.friend_id : r.user_id
            );

            const { data: profiles } = await supabase
                .from('profiles')
                .select('*')
                .in('id', friendIds);

            if (profiles) {
                setFriends(profiles);
            }
        };

        fetchData();
    }, [userId]);

    return (
        <div className={styles.friends}>
            <h2>
                Friends: <span>{friends.length}</span>
            </h2>
            <ul>
                {friends.map(friend => (
                    <li key={friend.id}>
                        <img src={friend.avatar_url} alt={friend.username} width={32} height={32} />
                        <span>{friend.username}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Friends;
