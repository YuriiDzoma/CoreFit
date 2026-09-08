import React from "react";
import styles from './userList.module.scss';
import elevatedStyles from "../../../../ui/elevatedCard/elevatedCard.module.scss";
import Link from "next/link";
import Image from "next/image";
import {ProfileType} from "@/types/user";
import {getText} from "@/store/selectors";
import {useAppSelector} from "@/app/hooks/redux";
import {formatLastActive} from "@/lib/lastActive";
import {avatarFallbackUrl} from "@/lib/avatarFallback";

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
    const { base } = useAppSelector(getText);
    const isOnline = formatLastActive(user.last_active_at)?.isOnline ?? false;

    return (
        <li className={elevatedStyles.elevated}>
            <Link href={`/profile/${user.id}`} className={styles.userLink}>
                <div className={styles.userLink__info}>
                    <div className={styles.avatarWrap}>
                        <Image
                            src={user.avatar_url || avatarFallbackUrl(user.username)}
                            width={34}
                            height={34}
                            alt={user.username}
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = avatarFallbackUrl(user.username);
                            }}
                        />
                        {isOnline && <span className={styles.onlineDot} />}
                    </div>
                    <p>{user.username}</p>
                </div>
            </Link>

            {user.id === userId ? null : pendingIds.includes(user.id) ? (
                <button
                    className={`${styles.userLink__btn} button ${styles.pending}`}
                    onClick={() => cancelFriend(user.id)}
                >
                    <span>{base.cancelRequest}</span>
                </button>
            ) : friendIds.includes(user.id) ? (
                <button
                    className={`${styles.userLink__btn} button ${styles.accepted}`}
                    onClick={() => removeFriend(user.id)}
                >
                    <span>{base.removeFriend}</span>
                </button>
            ) : (
                <button
                    className={`${styles.userLink__btn} button`}
                    onClick={() => addFriend(user)}
                    disabled={pendingIds.includes(user.id)}
                >
                    <span>{base.addFriends}</span>
                </button>
            )}
        </li>
    )
}

export default User;