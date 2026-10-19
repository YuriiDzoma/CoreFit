'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/app/hooks/redux';
import { getText, getUserId } from '@/store/selectors';
import { fetchUsers } from '@/lib/userData';
import { getOrCreateConversation } from '@/lib/messagesData';
import { avatarFallbackUrl } from '@/lib/avatarFallback';
import { UsersSkeleton } from '@/ui/skeleton/skeleton';
import elevatedStyles from '@/ui/elevatedCard/elevatedCard.module.scss';
import { ProfileType } from '@/types/user';
import styles from './newMessagePicker.module.scss';

// Any user, not just friends -- matches the product decision for this
// beta (no friends-only restriction). Reuses the same `fetchUsers`/search
// shape the Users page already has, just with a different row action.
export default function NewMessagePicker() {
    const router = useRouter();
    const userId = useAppSelector(getUserId);
    const { base } = useAppSelector(getText);

    const [users, setUsers] = useState<ProfileType[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [startingId, setStartingId] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers().then((fetched) => {
            setUsers(fetched);
            setLoading(false);
        });
    }, []);

    const trimmedQuery = searchQuery.trim().toLowerCase();
    const filteredUsers = useMemo(
        () =>
            users
                .filter((user) => user.id !== userId)
                .filter((user) => (trimmedQuery ? user.username.toLowerCase().includes(trimmedQuery) : true)),
        [users, userId, trimmedQuery]
    );

    const handlePick = async (profileId: string) => {
        if (!userId || startingId) return;
        setStartingId(profileId);
        const conversation = await getOrCreateConversation(userId, profileId);
        if (conversation) {
            router.replace(`/messages/${conversation.id}`);
        } else {
            setStartingId(null);
        }
    };

    return (
        <div className={styles.newMessage}>
            <h2 className="pageTitle">{base.newMessage}</h2>

            {loading ? (
                <UsersSkeleton />
            ) : (
                <>
                    {users.length > 0 && (
                        <div className={styles.searchRow}>
                            <input
                                className={styles.searchInput}
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                                placeholder={base.searchUsers}
                                type="search"
                            />
                            {searchQuery.length > 0 && (
                                <button className={styles.searchClear} onClick={() => setSearchQuery('')}>
                                    ✕
                                </button>
                            )}
                        </div>
                    )}

                    {trimmedQuery && filteredUsers.length === 0 ? (
                        <p>{base.noUsersMatch.replace('{value}', searchQuery.trim())}</p>
                    ) : (
                        <ul>
                            {filteredUsers.map((user) => (
                                <li key={user.id} className={elevatedStyles.elevated}>
                                    <button
                                        className={styles.userRow}
                                        onClick={() => handlePick(user.id)}
                                        disabled={startingId !== null}
                                    >
                                        <Image
                                            src={user.avatar_url || avatarFallbackUrl(user.username)}
                                            width={34}
                                            height={34}
                                            alt={user.username}
                                            className={styles.avatar}
                                        />
                                        <span>{user.username}</span>
                                        {startingId === user.id && <span className={styles.starting}>…</span>}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
}
