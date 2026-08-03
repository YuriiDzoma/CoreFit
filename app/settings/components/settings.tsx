'use client'
import React from "react";
import styles from './settings.module.scss';
import {LanguagesBox} from "./languagesBox";
import ProfileSettings from "./profileSettings";
import {useAppSelector} from "../../hooks/redux";
import {getText} from "../../../store/selectors";
import {useRouter} from "next/navigation";
import {signOut} from "@/lib/authClient";

const Settings = () => {
    const { base } = useAppSelector(getText);
    const router = useRouter();

    // Same no-confirmation, instant sign-out as the mobile app's own
    // Settings/Profile screens -- `useSupabaseSession`'s own
    // `onAuthStateChange` subscription reacts everywhere on its own, this
    // just also sends the user somewhere that doesn't require a session
    // rather than leaving them stranded on Settings.
    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };

    return (
        <div className={styles.settings}>
            <h2>{base.settings}</h2>
            <ProfileSettings />
            <LanguagesBox />
            <button className={styles.signOut} onClick={handleSignOut}>
                Sign out
            </button>
        </div>
    )
}

export default Settings;