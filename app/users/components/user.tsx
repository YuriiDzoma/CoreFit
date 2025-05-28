import React from "react";
import styles from './userList.module.scss';
import Link from "next/link";
import {ProfileType} from "../../../types/user";

interface FullPicturesProps {
    user: ProfileType,
    userId: string,
    pendingIds: string[],
    friendIds: string[],
    cancelFriend: (values: string) => void,
    addFriend: (values: ProfileType) => void,
    removeFriend: (values: string) => void,
}


const User = ({user, userId, pendingIds, friendIds, cancelFriend, addFriend, removeFriend}: FullPicturesProps) => {
    return (
        <li>
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
    )
}

export default User;