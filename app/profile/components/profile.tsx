import React from "react";
import styles from './profiles.module.scss'
import Image from "next/image";
import useWindowSize from "../../hooks/useWindowSize";
import {getUserId} from "../../../store/selectors";
import {useAppSelector} from "../../hooks/redux";

const Profile = ({profile}) => {
    const { width } = useWindowSize();
    const currentId = useAppSelector(getUserId);

    return (
        <div className={styles.profile}>
            <div className={styles.profile__header}>
                <Image
                    src={profile.avatar_url}
                    width={width < 768 ? 96 : 150}
                    height={width < 768 ? 96 : 150}
                    alt="avatar"
                />
                <div>
                    <p>{profile.username}</p>
                    <span>{new Date(profile.created_at).toLocaleString()}</span>
                </div>
                {currentId === profile.id && (
                    <button className={styles.settings}>
                        <Image
                            src="/icons/settings.svg"
                            width={24}
                            height={24}
                            alt="settings"
                        />
                    </button>
                )}
            </div>
        </div>
    )
}

export default Profile;