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

export function ProfileFriendsSkeleton() {
    return (
        <div className={styles.profileFriends}>
            <div className={styles.profileFriends__header}>
                <span className={styles.profileFriends__title}/>
                <span className={styles.profileFriends__link}/>
            </div>
            <ul>
                <li>
                    <span className={styles.profileFriends__img}/>
                    <span className={styles.profileFriends__name}/>
                </li>
                <li>
                    <span className={styles.profileFriends__img}/>
                    <span className={styles.profileFriends__name}/>
                </li>
                <li>
                    <span className={styles.profileFriends__img}/>
                    <span className={styles.profileFriends__name}/>
                </li>
                <li>
                    <span className={styles.profileFriends__img}/>
                    <span className={styles.profileFriends__name}/>
                </li>
            </ul>
        </div>
    )
}

export function ExerciseListSkeleton() {
    return (
        <div>
            <span className={styles.title}/>
            <div className={styles.wiki}>
                <div className={styles.exercisesList}>
                    <div className={styles.exercisesList__row}>
                        <span className={styles.exercisesList__img}/>
                        <span className={styles.exercisesList__name}/>
                    </div>
                    <div className={styles.exercisesList__row}>
                        <span className={styles.exercisesList__img}/>
                        <span className={styles.exercisesList__name}/>
                    </div>
                    <div className={styles.exercisesList__row}>
                        <span className={styles.exercisesList__img}/>
                        <span className={styles.exercisesList__name}/>
                    </div>
                    <div className={styles.exercisesList__row}>
                        <span className={styles.exercisesList__img}/>
                        <span className={styles.exercisesList__name}/>
                    </div>
                    <div className={styles.exercisesList__row}>
                        <span className={styles.exercisesList__img}/>
                        <span className={styles.exercisesList__name}/>
                    </div>
                    <div className={styles.exercisesList__row}>
                        <span className={styles.exercisesList__img}/>
                        <span className={styles.exercisesList__name}/>
                    </div>
                    <div className={styles.exercisesList__row}>
                        <span className={styles.exercisesList__img}/>
                        <span className={styles.exercisesList__name}/>
                    </div>
                    <div className={styles.exercisesList__row}>
                        <span className={styles.exercisesList__img}/>
                        <span className={styles.exercisesList__name}/>
                    </div>
                    <div className={styles.exercisesList__row}>
                        <span className={styles.exercisesList__img}/>
                        <span className={styles.exercisesList__name}/>
                    </div>
                </div>
                <ul className={styles.wiki__groups}>
                    <li className={styles.wiki__group}/>
                    <li className={styles.wiki__group}/>
                    <li className={styles.wiki__group}/>
                    <li className={styles.wiki__group}/>
                    <li className={styles.wiki__group}/>
                    <li className={styles.wiki__group}/>
                    <li className={styles.wiki__group}/>
                    <li className={styles.wiki__group}/>
                </ul>
            </div>
        </div>
    )
}

export function ExerciseSkeleton() {
    return (
        <div className={styles.exercise}>
            <span className={styles.title}/>
            <span className={styles.exercise__row}/>
            <span className={styles.exercise__row}/>
            <span className={styles.exercise__image}/>
            <span className={styles.exercise__text}/>
            <span className={styles.exercise__video}/>
        </div>
    )
}

export function ProgramsList() {
    return (
        <div>
            <span className={styles.title}/>
            <span className={styles.programList__create}/>
            <ul className={styles.programList__list}>
                <li  className={styles.programList__item}/>
                <li  className={styles.programList__item}/>
            </ul>
        </div>
    )
}


