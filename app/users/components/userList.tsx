'use client';

import React, { useEffect, useState } from 'react';
import {getText} from "../../../store/selectors";
import {useAppSelector} from "../../hooks/redux";
import styles from './userList.module.scss'
import {UsersPageSkeleton} from "../../../ui/skeleton/skeleton";
import {fetchUsers} from "../../../lib/userData";
import Link from 'next/link';
import {User} from "../../../types/user";


export default function UserList() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const { base } = useAppSelector(getText);

    useEffect(() => {
        fetchUsers().then((fetchedUsers) => {
            setUsers(fetchedUsers);
            setLoading(false);
        });
    }, []);

    if (loading) return <UsersPageSkeleton />;

    return (
        <div className={styles.users}>
            <h2>{base.allUsers}</h2>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        <Link href={`/profile/${user.id}`} className={styles.userLink}>
                            <img src={user.avatar_url} alt={user.username} />
                            <p>{user.username}</p>
                            {/*<small>{new Date(user.created_at).toLocaleString()}</small>*/}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
