'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { getAllFriendsOfUser } from '@/lib/friendData';
import { ProfileType } from '@/types/user';
import styles from './profiles.module.scss';

const Friends = () => {
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [friends, setFriends] = useState<ProfileType[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            setCurrentUserId(user.id);

            // 1. Отримуємо всі дружні зв’язки
            const records = await getAllFriendsOfUser(user.id);

            // 2. Визначаємо ID усіх інших користувачів у зв’язках
            const friendIds = records.map(r => r.user_id === user.id ? r.friend_id : r.user_id);

            // 3. Отримуємо профілі цих юзерів
            const { data: profiles } = await supabase
                .from('profiles')
                .select('*')
                .in('id', friendIds);

            if (profiles) {
                setFriends(profiles);
            }
        };

        fetchData();
    }, []);

    return (
        <div className={styles.friends}>
            <h2>Friends: <span>{friends.length}</span></h2>
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
