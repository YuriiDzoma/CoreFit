'use client';

import React, { useEffect, useState } from 'react';
import { getText, getUserId } from '@/store/selectors';
import { useAppSelector } from '@/app/hooks/redux';
import styles from './userList.module.scss';
import { UsersPageSkeleton } from '@/ui/skeleton/skeleton';
import { fetchUsers } from '@/lib/userData';
import { ProfileType } from '@/types/user';
import {
    sendFriendRequest,
    cancelFriendRequest,
    getAllFriendsOfUser,
} from '@/lib/friendData';
import {getOutgoingPendingRequests, removeFriendship} from "../../../lib/friendData";
import User from "./user";
import Preloader from "../../../ui/preloader/Preloader";

export default function UserList() {
    const userId = useAppSelector(getUserId);
    const { base } = useAppSelector(getText);

    const [users, setUsers] = useState<ProfileType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isPreloader, setIsPreloader] = useState<boolean>(false);

    const [pendingIds, setPendingIds] = useState<string[]>([]);
    const [friendIds, setFriendIds] = useState<string[]>([]);

    useEffect(() => {
        const init = async () => {
            if (!userId) {
                setLoading(false);
                return;
            }

            const [fetchedUsers, pendingRaw, acceptedRelations] = await Promise.all([
                fetchUsers(),
                getOutgoingPendingRequests(userId),
                getAllFriendsOfUser(userId),
            ]);

            setUsers(fetchedUsers);
            setPendingIds(pendingRaw);

            const accepted = acceptedRelations.map(r =>
                r.user_id === userId ? r.friend_id : r.user_id
            );
            setFriendIds(accepted);

            setLoading(false);
        };

        init();
    }, [userId]);


    const cancelFriend = async (friendId: string) => {
        setIsPreloader(true);
        const res = await cancelFriendRequest(friendId);
        if (res) {
            setPendingIds((prev) => prev.filter((id) => id !== friendId));
        }
        setIsPreloader(false);
    };

    const addFriend = async (user: ProfileType) => {
        setIsPreloader(true);
        setPendingIds((prev) => [...prev, user.id]);

        const res = await sendFriendRequest(user.id);
        if (!res) {
            setPendingIds((prev) => prev.filter((id) => id !== user.id));
        }
        setIsPreloader(false);
    };

    const removeFriend = async (friendId: string) => {
        setIsPreloader(true);
        const res = await removeFriendship(friendId);
        if (res) {
            setFriendIds((prev) => prev.filter((id) => id !== friendId));
        }
        setIsPreloader(false);
    };

    if (loading) return <UsersPageSkeleton />;

    return (
        <div className={styles.users}>
            <h2>{base.allUsers}</h2>
            <ul>
                {userId && users && users.map((user) => {
                    return (
                        <User key={user.id}
                              user={user}
                              userId={userId}
                              pendingIds={pendingIds}
                              friendIds={friendIds}
                              cancelFriend={cancelFriend}
                              addFriend={addFriend}
                              removeFriend={removeFriend}
                        />
                    );
                })}
            </ul>
            {isPreloader && <Preloader />}
        </div>
    );
}
