'use client'
import React, {useEffect, useState} from "react";
import {useAppSelector} from "../../hooks/redux";
import { useParams } from "next/navigation";
import {getText, getUserId} from "../../../store/selectors";
import Link from "next/link";
import Image from "next/image";
import styles from '../components/allFriends.module.scss'
import {ProfileType} from "../../../types/user";
import {fetchLimitedFriendProfiles} from "../../../lib/userData";
import {getAllFriendsOfUser} from "../../../lib/friendData";
import {useFriendRequestStore} from "@/store/useFriendRequestStore";


const AllFriends = () => {
    const {base} = useAppSelector(getText);
    const currentUserId = useAppSelector(getUserId);
    const { id } = useParams();
    const [friends, setFriends] = useState<ProfileType[]>([]);
    const [loading, setLoading] = useState(true);
    const { requests } = useFriendRequestStore();

    const isOwnProfile = !!currentUserId && currentUserId === id;

    useEffect(() => {
        const fetchData = async () => {
            if (!id || typeof id !== 'string') return;

            const friendLinks = await getAllFriendsOfUser(id);
            const friendIds = friendLinks.map(r =>
                r.user_id === id ? r.friend_id : r.user_id
            );

            const allFriends = await fetchLimitedFriendProfiles(friendIds, 100);
            setFriends(allFriends);
            setLoading(false);
        };
        fetchData();
    }, [id]);

    if (loading) return <p>{base.loading}</p>;

    return (
        <div className={styles.allFriends}>
            <h2 className={'pageTitle'}>{base.friends}</h2>

            {/* Discoverability path to /users -- previously reachable only
                via the bottom nav's Users tab. Own-profile only, same
                reasoning as the requests banner below: browsing to add new
                friends doesn't belong on someone else's Friends page. */}
            {isOwnProfile && (
                <Link href="/users" className={styles.requestsBanner}>
                    <span>{base.browseUsers}</span>
                    <span>›</span>
                </Link>
            )}

            {/* Requests has no nav entry point of its own now that the
                primary bar's Friends badge is a count only (not a link) —
                this is the one path back to it, shown only on your own
                Friends page and only when there's something to act on. */}
            {isOwnProfile && requests.length > 0 && (
                <Link href="/requests" className={styles.requestsBanner}>
                    <span>{base.friendRequestsLabel.replace('{value}', requests.length > 99 ? '99+' : String(requests.length))}</span>
                    <span>›</span>
                </Link>
            )}

            <ul className={styles.friendList}>
                {friends.map(friend => (
                    <Link
                        href={`/profile/${friend.id}`}
                        key={friend.id}
                        className={styles.friendList__link}
                    >
                        <img src={friend.avatar_url} alt={friend.username}/>
                        <span className={styles.friendList__name}>{friend.username}</span>
                    </Link>
                ))}
            </ul>
        </div>
    )
}

export default AllFriends;