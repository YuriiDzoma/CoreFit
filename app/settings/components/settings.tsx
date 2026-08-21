'use client'
import React, {useState} from "react";
import styles from './settings.module.scss';
import {LanguagesBox} from "./languagesBox";
import ProfileSettings from "./profileSettings";
import TrainerSettings from "./trainerSettings";
import CitySettings from "./citySettings";
import GlobalPopup from "@/app/components/globalPopup/globalPopup";
import {useAppSelector} from "../../hooks/redux";
import {getText} from "../../../store/selectors";
import {useRouter} from "next/navigation";
import {signOut} from "@/lib/authClient";
import {deleteOwnAccount} from "@/lib/accountData";

const Settings = () => {
    const { base } = useAppSelector(getText);
    const router = useRouter();
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    // Same no-confirmation, instant sign-out as the mobile app's own
    // Settings/Profile screens -- `useSupabaseSession`'s own
    // `onAuthStateChange` subscription reacts everywhere on its own, this
    // just also sends the user somewhere that doesn't require a session
    // rather than leaving them stranded on Settings.
    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };

    // Opens the existing GlobalPopup (already used for friend/trainer
    // removal) rather than firing instantly like Sign Out does -- the
    // actual deletion happens in handleConfirmDelete below, once the
    // user confirms in that dialog.
    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        setDeleteError(null);
        const success = await deleteOwnAccount();
        if (success) {
            await signOut();
            router.push('/');
        } else {
            setDeleteError(base.deleteAccountError);
            setIsDeleting(false);
        }
        setConfirmingDelete(false);
    };

    return (
        <div className={styles.settings}>
            <h2>{base.settings}</h2>
            <ProfileSettings />
            <TrainerSettings />
            <CitySettings />
            <LanguagesBox />
            <button
                className={styles.deleteAccount}
                onClick={() => setConfirmingDelete(true)}
                disabled={isDeleting}
            >
                {base.deleteAccount}
            </button>
            {deleteError && <span className={styles.deleteAccountError}>{deleteError}</span>}
            <button className={styles.signOut} onClick={handleSignOut}>
                {base.signOut}
            </button>

            {confirmingDelete && (
                <GlobalPopup
                    title={base.deleteAccountConfirmTitle}
                    message={base.deleteAccountConfirmMessage}
                    onConfirm={handleDeleteAccount}
                    onCancel={() => setConfirmingDelete(false)}
                />
            )}
        </div>
    )
}

export default Settings;