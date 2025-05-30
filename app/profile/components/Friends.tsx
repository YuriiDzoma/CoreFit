'use client';

import React, { useEffect, useState } from 'react';
import { getAllFriendsOfUser } from '@/lib/friendData';
import { fetchLimitedFriendProfiles } from '@/lib/userData';
import { ProfileType } from '@/types/user';
import styles from './profiles.module.scss';
import { getUserId } from '@/store/selectors';
import { useAppSelector } from '@/app/hooks/redux';
import Image from "next/image";
import Link from "next/link";
import {ProfileFriendsSkeleton} from "../../../ui/skeleton/skeleton";

const Friends = () => {
    const userId = useAppSelector(getUserId);
    const [friends, setFriends] = useState<ProfileType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!userId) return;

            const friendLinks = await getAllFriendsOfUser(userId);
            const friendIds = friendLinks.map(r =>
                r.user_id === userId ? r.friend_id : r.user_id
            );

            const limitedFriends = await fetchLimitedFriendProfiles(friendIds, 12);
            setFriends(limitedFriends);
            setLoading(false);
        };
        fetchData();
    }, [userId]);

    if (loading) return <ProfileFriendsSkeleton />;

    return (
        <div className={styles.friends}>
            {friends?.length > 0 && (
                <div className={styles.friends__header}>
                    <h2>Friends: <span>{friends.length}</span></h2>
                    <Link href={'/friends'}>
                        <span>See all friends</span>
                    </Link>
                </div>
            )}
            <ul>
                {friends.map(friend => (
                    <li key={friend.id}>
                        <Image
                            src={friend.avatar_url}
                            width={64}
                            height={64}
                            alt={friend.username}
                        />
                        <span className={styles.friends__name}>{friend.username}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Friends;
