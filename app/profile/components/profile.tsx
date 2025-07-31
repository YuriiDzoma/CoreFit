import React from "react";
import styles from './profiles.module.scss'
import Image from "next/image";
import useWindowSize from "../../hooks/useWindowSize";
import {getIsDarkTheme, getText, getUserId} from "../../../store/selectors";
import {useAppSelector} from "../../hooks/redux";
import {ProfileType} from "../../../types/user";
import Link from "next/link";

const Profile = ({profile}: {profile: ProfileType}) => {
    const { width } = useWindowSize();
    const { base } = useAppSelector(getText);
    const currentId = useAppSelector(getUserId);
    const isDark = useAppSelector(getIsDarkTheme);

    return (
        <div className={styles.profile}>
            <div className={styles.profile__header}>

                <Image
                    src={profile.avatar_url}
                    width={width < 768 ? 96 : 150}
                    height={width < 768 ? 96 : 150}
                    alt="avatar"
                    unoptimized
                />

                <div>
                    <p>{profile.username}</p>
                    <span>{new Date(profile.created_at).toLocaleString()}</span>
                    <Link className={styles.programsLink} href={`/training/${profile.id}`}>
                        <span>{base.programs}</span>
                    </Link>
                </div>

                {currentId === profile.id && (
                    <Link className={styles.settings} href="/settings" >
                        <Image
                            src={isDark ? "/icons/settings.svg" : "/icons/settingsDark.svg"}
                            width={24}
                            height={24}
                            alt="settings"
                            unoptimized
                        />
                    </Link>
                )}

            </div>
        </div>
    )
}

export default Profile;