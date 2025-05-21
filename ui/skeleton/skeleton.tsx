import styles from './skeleton.module.scss'
import React from "react";

export function UsersPageSkeleton() {
    return (
        <div className={styles.usersPage}>
            <div className={styles.usersPage__title}/>
            <UsersSkeleton/>
        </div>
    )
}

export function UsersSkeleton() {
    return (
        <ul className={styles.users}>
            <li className={styles.user}>
                <span className={styles.user__img}/>
                <span className={styles.user__name}/>
            </li>
            <li className={styles.user}>
                <span className={styles.user__img}/>
                <span className={styles.user__name}/>
            </li>
            <li className={styles.user}>
                <span className={styles.user__img}/>
                <span className={styles.user__name}/>
            </li>
        </ul>
    )
}