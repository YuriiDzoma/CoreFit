'use client';

import { useAppSelector } from '@/app/hooks/redux';
import styles from './requests.module.scss';
import { getText, getUserId } from '@/store/selectors';
import {
    acceptFriendRequest,
    declineFriendRequest,
} from '@/lib/friendData';
import {
    acceptTrainerRequest,
    declineTrainerRequest,
    fetchIncomingTrainerRequests,
} from '@/lib/trainerClientData';
import { fetchProfilesByIds } from '@/lib/userData';
import React, { useEffect, useState } from 'react';
import { ProfileType } from '@/types/user';
import type { TrainerClientRecord } from '@/types/trainerClient';
import Image from 'next/image';
import { useFriendRequestStore } from '@/store/useFriendRequestStore';

const Requests = () => {
    const userId = useAppSelector(getUserId);
    const { base } = useAppSelector(getText);

    const { requests, removeRequest, subscribeToRealtime } = useFriendRequestStore();
    const [usersMap, setUsersMap] = useState<Record<string, ProfileType>>({});
    const [isLoading, setIsLoading] = useState(false);

    // No dedicated store/Realtime for trainer requests in this first
    // pass (matching how Friend Requests itself started before it grew
    // one) -- a plain fetch on mount is enough; easy to promote to a
    // store the same way later if it's ever needed.
    const [trainerRequests, setTrainerRequests] = useState<TrainerClientRecord[]>([]);
    const [isTrainerLoading, setIsTrainerLoading] = useState(false);

    useEffect(() => {
        if (!userId) return;
        subscribeToRealtime(userId);
        fetchIncomingTrainerRequests(userId).then(setTrainerRequests);
    }, [userId]);

    useEffect(() => {
        const ids = [
            ...requests.map(r => r.user_id),
            ...trainerRequests.map(r => r.client_id),
        ];
        if (ids.length === 0) return;

        fetchProfilesByIds(ids).then((map) => setUsersMap((prev) => ({ ...prev, ...map })));
    }, [requests, trainerRequests]);


    const handleAccept = async (id: string) => {
        setIsLoading(true);
        await acceptFriendRequest(id);
        removeRequest(id);
        setIsLoading(false);
    };

    const handleDecline = async (id: string) => {
        setIsLoading(true);
        await declineFriendRequest(id);
        removeRequest(id);
        setIsLoading(false);
    };

    const handleAcceptTrainer = async (id: string) => {
        setIsTrainerLoading(true);
        await acceptTrainerRequest(id);
        setTrainerRequests((prev) => prev.filter((r) => r.id !== id));
        setIsTrainerLoading(false);
    };

    const handleDeclineTrainer = async (id: string) => {
        setIsTrainerLoading(true);
        await declineTrainerRequest(id);
        setTrainerRequests((prev) => prev.filter((r) => r.id !== id));
        setIsTrainerLoading(false);
    };

    if (!userId) return null;
    if (isLoading) return <p>{base.loading}</p>;

    return (
        <div>
            <h2 className="pageTitle">{base.requests}</h2>

            <h3 className={styles.requestsTitle}>{base.friendRequestsTitle}</h3>
            {requests.length === 0 ? (
                <p>{base.noFriendRequests}</p>
            ) : (
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
                                        unoptimized
                                    />
                                    <span>{user.username}</span>
                                </div>

                                <div className={styles.request__actions}>
                                    <button onClick={() => handleAccept(req.id)} className="button" disabled={isLoading}>
                                        <span>{base.accept}</span>
                                    </button>
                                    <button onClick={() => handleDecline(req.id)} className="button" disabled={isLoading}>
                                        <span>{base.decline}</span>
                                    </button>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}

            <h3 className={styles.requestsTitle}>{base.trainerRequestsTitle}</h3>
            {trainerRequests.length === 0 ? (
                <p>{base.noTrainerRequests}</p>
            ) : (
                <ul className={styles.requestsList}>
                    {trainerRequests.map((req) => {
                        const user = usersMap[req.client_id];
                        if (!user) return null;

                        return (
                            <li key={req.id} className={styles.request}>
                                <div className={styles.request__info}>
                                    <Image
                                        src={user.avatar_url}
                                        width={96}
                                        height={96}
                                        alt={user.username}
                                        unoptimized
                                    />
                                    <span>{user.username}</span>
                                </div>

                                <div className={styles.request__actions}>
                                    <button onClick={() => handleAcceptTrainer(req.id)} className="button" disabled={isTrainerLoading}>
                                        <span>{base.accept}</span>
                                    </button>
                                    <button onClick={() => handleDeclineTrainer(req.id)} className="button" disabled={isTrainerLoading}>
                                        <span>{base.decline}</span>
                                    </button>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default Requests;
