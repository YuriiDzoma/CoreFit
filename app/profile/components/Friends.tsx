'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './profiles.module.scss';
import { useAppSelector } from '@/app/hooks/redux';
import { getText } from '@/store/selectors';
import type { ProfileType } from '@/types/user';

type FriendsProps = {
    id: string;
    initial: ProfileType[];
};

export default function Friends({ id, initial }: FriendsProps) {
    const { base } = useAppSelector(getText);

    if (!initial || initial.length === 0) {
        return null;
    }

    return (
        <div className={styles.friends}>
            <div className={styles.friends__header}>
                <h2>
                    {base.friends}: <span>{initial.length}</span>
                </h2>
                <Link href={`/friends/${id}`}>
                    <span>{base.seeAllFriends}</span>
                </Link>
            </div>

            <ul>
                {initial.map((friend) => (
                    <li key={friend.id}>
                        <Link href={`/profile/${friend.id}`} className={styles.friends__link}>
                            <Image
                                src={friend.avatar_url || '/avatar-placeholder.png'}
                                alt={friend.username || 'user'}
                                width={40}
                                height={40}
                            />
                            <span className={styles.friends__name}>{friend.username}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
