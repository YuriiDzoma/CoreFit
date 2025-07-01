'use client'
import React, {useEffect, useState} from "react";
import {useAppSelector} from "../../hooks/redux";
import { useParams } from "next/navigation";
import {getText} from "../../../store/selectors";
import Link from "next/link";
import Image from "next/image";
import styles from '../components/allFriends.module.scss'
import {ProfileType} from "../../../types/user";
import {fetchLimitedFriendProfiles} from "../../../lib/userData";
import {getAllFriendsOfUser} from "../../../lib/friendData";


const AllFriends = () => {
    const {base} = useAppSelector(getText);
    const { id } = useParams();
    const [friends, setFriends] = useState<ProfileType[]>([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <p>Loading...</p>;


    return (
        <div className={styles.allFriends}>
            <h2 className={'pageTitle'}>{base.friends}</h2>
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