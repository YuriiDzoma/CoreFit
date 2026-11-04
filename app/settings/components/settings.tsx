'use client'
import React, {useState} from "react";
import Link from "next/link";
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
    const [confirmingSignOut, setConfirmingSignOut] = useState(false);

    // Runs once the GlobalPopup below is confirmed (same as the mobile app).
    // `useSupabaseSession`'s own `onAuthStateChange` subscription reacts
    // everywhere on its own; this also sends the user somewhere that
    // doesn't require a session rather than leaving them on Settings.
    const handleSignOut = async () => {
        setConfirmingSignOut(false);
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
            {/* Two stacks side by side from 1200px (settings.module.scss
                `.sections`); one column, in this same order, below that. */}
            <div className={styles.sections}>
                <div>
                    <ProfileSettings />
                    <TrainerSettings />
                </div>
                <div>
                    <CitySettings />
                    <LanguagesBox />
                </div>
            </div>
            <Link href="/privacy" className={styles.privacyLink}>
                {base.privacyPolicy}
            </Link>
            <div className={styles.actions}>
                <button
                    className={styles.deleteAccount}
                    onClick={() => setConfirmingDelete(true)}
                    disabled={isDeleting}
                >
                    {base.deleteAccount}
                </button>
                {deleteError && <span className={styles.deleteAccountError}>{deleteError}</span>}
                <button className={styles.signOut} onClick={() => setConfirmingSignOut(true)}>
                    {base.signOut}
                </button>
            </div>

            {confirmingDelete && (
                <GlobalPopup
                    title={base.deleteAccountConfirmTitle}
                    message={base.deleteAccountConfirmMessage}
                    onConfirm={handleDeleteAccount}
                    onCancel={() => setConfirmingDelete(false)}
                />
            )}

            {confirmingSignOut && (
                <GlobalPopup
                    title={base.signOutConfirmTitle}
                    message={base.signOutConfirmMessage}
                    onConfirm={handleSignOut}
                    onCancel={() => setConfirmingSignOut(false)}
                />
            )}
        </div>
    )
}

export default Settings;