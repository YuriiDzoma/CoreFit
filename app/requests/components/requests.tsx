'use client';

import { useAppSelector } from '@/app/hooks/redux';
import styles from './requests.module.scss';
import { getText, getUserId } from '@/store/selectors';
import {
    acceptFriendRequest,
    declineFriendRequest,
} from '@/lib/friendData';
import { fetchProfilesByIds } from '@/lib/userData';
import React, { useEffect, useState } from 'react';
import { ProfileType } from '@/types/user';
import Image from 'next/image';
import {useFriendRequests} from "../../hooks/useFriendRequests";

const Requests = () => {
    const userId = useAppSelector(getUserId);
    const { base } = useAppSelector(getText);

    const { requests, setRequests, subscribeToChanges } = useFriendRequests(userId);
    const [usersMap, setUsersMap] = useState<Record<string, ProfileType>>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!userId) return;

        const ids = requests.map((r) => r.user_id);
        fetchProfilesByIds(ids).then((map) => setUsersMap(map));

        const unsubscribe = subscribeToChanges((newUserId) => {
            if (!usersMap[newUserId]) {
                fetchProfilesByIds([newUserId]).then((map) => {
                    setUsersMap((prev) => ({ ...prev, ...map }));
                });
            }
        });

        return unsubscribe;
    }, [userId, requests]);

    const handleAccept = async (id: string) => {
        setIsLoading(true);
        await acceptFriendRequest(id);
        setRequests(prev => prev.filter(req => req.id !== id));
        setIsLoading(false);
    };

    const handleDecline = async (id: string) => {
        setIsLoading(true);
        await declineFriendRequest(id);
        setRequests(prev => prev.filter(req => req.id !== id));
        setIsLoading(false);
    };


    if (!userId) return null;
    if (isLoading) return <p>LOADING...</p>;

    return (
        <div>
            <h2>Requests</h2>
            <ul className={styles.requestsList}>
                {requests.map((req) => {
                    const user = usersMap[req.user_id];
                    if (!user) return null;

                    return (
                        <li key={req.id} className={styles.request}>
                            <div className={styles.request__info}>
                                <Image
                                    src={user.avatar_url}
                                    width={96}
                                    height={96}
                                    alt={user.username}
                                />
                                <span>{user.username}</span>
                            </div>

                            <div className={styles.request__actions}>
                                <button onClick={() => handleAccept(req.id)} className="button" disabled={isLoading}>
                                    <span>Accept</span>
                                </button>
                                <button onClick={() => handleDecline(req.id)} className="button" disabled={isLoading}>
                                    <span>Decline</span>
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Requests;
