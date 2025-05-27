'use client';

import React, { useEffect, useState } from 'react';
import { getText, getUserId } from '@/store/selectors';
import { useAppSelector } from '@/app/hooks/redux';
import styles from './userList.module.scss';
import { UsersPageSkeleton } from '@/ui/skeleton/skeleton';
import { fetchUsers } from '@/lib/userData';
import Link from 'next/link';
import { ProfileType } from '@/types/user';
import {
    sendFriendRequest,
    cancelFriendRequest,
    getAllFriendsOfUser,
} from '@/lib/friendData';

export default function UserList() {
    const userId = useAppSelector(getUserId);
    const { base } = useAppSelector(getText);

    const [users, setUsers] = useState<ProfileType[]>([]);
    const [loading, setLoading] = useState(true);

    const [pendingIds, setPendingIds] = useState<string[]>([]);
    const [friendIds, setFriendIds] = useState<string[]>([]);

    useEffect(() => {
        const init = async () => {
            if (!userId) {
                setLoading(false);
                return;
            }

            const [fetchedUsers, allRelations] = await Promise.all([
                fetchUsers(),
                getAllFriendsOfUser(userId),
            ]);

            setUsers(fetchedUsers);

            const pending: string[] = [];
            const accepted: string[] = [];

            allRelations.forEach((r) => {
                const otherId = r.user_id === userId ? r.friend_id : r.user_id;
                if (r.status === 'pending') pending.push(otherId);
                else if (r.status === 'accepted') accepted.push(otherId);
            });

            setPendingIds(pending);
            setFriendIds(accepted);
            setLoading(false);
        };

        init();
    }, [userId]);

    const cancelFriend = async (friendId: string) => {
        const res = await cancelFriendRequest(friendId);
        if (res) {
            setPendingIds((prev) => prev.filter((id) => id !== friendId));
        }
    };

    const addFriend = async (user: ProfileType) => {
        setPendingIds((prev) => [...prev, user.id]);

        const res = await sendFriendRequest(user.id);
        if (!res) {
            setPendingIds((prev) => prev.filter((id) => id !== user.id));
        }
    };

    const removeFriend = async (friendId: string) => {
        const res = await cancelFriendRequest(friendId);
        if (res) {
            setFriendIds((prev) => prev.filter((id) => id !== friendId));
        }
    };

    if (loading) return <UsersPageSkeleton />;

    return (
        <div className={styles.users}>
            <h2>{base.allUsers}</h2>
            <ul>
                {users.map((user) => {
                    return (
                        <li key={user.id}>
                            <Link href={`/profile/${user.id}`} className={styles.userLink}>
                                <div className={styles.userLink__info}>
                                    <img src={user.avatar_url} alt={user.username} />
                                    <p>{user.username}</p>
                                </div>
                            </Link>

                            {user.id === userId ? null : pendingIds.includes(user.id) ? (
                                <button
                                    className={`${styles.userLink__btn} button ${styles.pending}`}
                                    onClick={() => cancelFriend(user.id)}
                                >
                                    <span>Cancel request</span>
                                </button>
                            ) : friendIds.includes(user.id) ? (
                                <button
                                    className={`${styles.userLink__btn} button ${styles.accepted}`}
                                    onClick={() => removeFriend(user.id)}
                                >
                                    <span>Remove friend</span>
                                </button>
                            ) : (
                                <button
                                    className={`${styles.userLink__btn} button`}
                                    onClick={() => addFriend(user)}
                                    disabled={pendingIds.includes(user.id)}
                                >
                                    <span>Add to friends</span>
                                </button>
                            )}
                        </li>
                    );
                })}

            </ul>
        </div>
    );
}
