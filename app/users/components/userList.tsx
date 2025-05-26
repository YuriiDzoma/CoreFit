'use client';

import React, { useEffect, useState } from 'react';
import { getText } from "../../../store/selectors";
import { useAppSelector } from "../../hooks/redux";
import styles from './userList.module.scss';
import { UsersPageSkeleton } from "../../../ui/skeleton/skeleton";
import { fetchUsers } from "../../../lib/userData";
import Link from 'next/link';
import { ProfileType } from "../../../types/user";
import {sendFriendRequest, getSentFriendRequests, cancelFriendRequest} from "../../../lib/friendData";
import { createClient } from '@/utils/supabase/client';

export default function UserList() {
    const [users, setUsers] = useState<ProfileType[]>([]);
    const [loading, setLoading] = useState(true);
    const [pendingIds, setPendingIds] = useState<string[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    const { base } = useAppSelector(getText);

    useEffect(() => {
        const init = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setLoading(false);
                return;
            }

            setCurrentUserId(user.id);

            const fetchedUsers = await fetchUsers();
            setUsers(fetchedUsers);

            const sentRequests = await getSentFriendRequests(user.id);
            const pendingFriendIds = sentRequests
                .filter((r) => r.status === 'pending')
                .map((r) => r.friend_id);
            setPendingIds(pendingFriendIds);

            setLoading(false);
        };

        init();
    }, []);


    const cancelFriend = async (friendId: string) => {
        const res = await cancelFriendRequest(friendId);
        if (res) {
            setPendingIds((prev) => prev.filter((id) => id !== friendId));
        }
    };


    const addFriend = async (user: ProfileType) => {
        setPendingIds(prev => [...prev, user.id]);

        const res = await sendFriendRequest(user.id);
        if (!res) {
            setPendingIds(prev => prev.filter(id => id !== user.id));
        }
    };

    if (loading) return <UsersPageSkeleton />;

    return (
        <div className={styles.users}>
            <h2>{base.allUsers}</h2>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        <Link href={`/profile/${user.id}`} className={styles.userLink}>
                            <div className={styles.userLink__info}>
                                <img src={user.avatar_url} alt={user.username} />
                                <p>{user.username}</p>
                            </div>
                        </Link>

                        {/* НЕ показувати кнопку, якщо це я сам */}
                        {user.id === currentUserId ? null : (
                            pendingIds.includes(user.id) ? (
                                <button
                                    className={`${styles.userLink__btn} button ${styles.pending}`}
                                    onClick={() => cancelFriend(user.id)}
                                >
                                    <span>Cancel request</span>
                                </button>
                            ) : (
                                <button
                                    className={`${styles.userLink__btn} button`}
                                    onClick={() => addFriend(user)}
                                    disabled={pendingIds.includes(user.id)}
                                >
                                    <span>Add to friends</span>
                                </button>
                            )
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
