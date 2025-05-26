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
                <div className={styles.user__info}>
                    <span className={styles.user__img}/>
                    <span className={styles.user__name}/>
                </div>
                <span className={styles.user__btn}/>
            </li>
            <li className={styles.user}>
                <div className={styles.user__info}>
                    <span className={styles.user__img}/>
                    <span className={styles.user__name}/>
                </div>
                <span className={styles.user__btn}/>
            </li>
            <li className={styles.user}>
                <div className={styles.user__info}>
                    <span className={styles.user__img}/>
                    <span className={styles.user__name}/>
                </div>
                <span className={styles.user__btn}/>
            </li>
        </ul>
    )
}

export function ProfileSkeleton() {
    return (
        <div className={styles.profile}>
            <span className={styles.profile__img}/>
            <div className={styles.profile__name}>
                <span className={styles.profile__txt}/>
                <span className={styles.profile__txtSecond}/>
            </div>
        </div>
    )
}

export function ProfileSettingsSkeleton() {
    return (
        <div className={styles.profileSettings}>
            <span className={styles.profileSettings__title} />
            <ul>
                <li>
                    <span className={styles.profileSettings__label}/>
                    <span className={styles.profileSettings__field}/>
                </li>
                <li>
                    <span className={styles.profileSettings__label}/>
                    <span className={styles.profileSettings__field}/>
                </li>
            </ul>
            <span className={styles.profileSettings__btn}/>
        </div>
    )
}