'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './profiles.module.scss';
import { useAppSelector } from '@/app/hooks/redux';
import { getText } from '@/store/selectors';
import type { ProfileType } from '@/types/user';

type TrainerClientsProps = {
    isTrainer: boolean;
    people: ProfileType[];
};

// Same `.friends`/`.friends__link` classes as Friends.tsx -- visually the
// same block, just a different label and no "See all" link (there's no
// dedicated full-list screen for this the way /friends/[id] exists for
// friends -- usually one trainer, or a handful of clients).
export default function TrainerClients({ isTrainer, people }: TrainerClientsProps) {
    const { base } = useAppSelector(getText);

    return (
        <div className={styles.friends}>
            <div className={styles.friends__header}>
                <h2>
                    {isTrainer ? base.clientsLabel : base.trainerLabel}: <span>{people.length}</span>
                </h2>
            </div>

            <ul>
                {people.map((person) => (
                    <li key={person.id}>
                        <Link href={`/profile/${person.id}`} className={styles.friends__link}>
                            <Image
                                src={person.avatar_url || '/avatar-placeholder.png'}
                                alt={person.username || 'user'}
                                width={40}
                                height={40}
                            />
                            <span className={styles.friends__name}>{person.username}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
