'use client';

import Image from "next/image";
import React, {useEffect, useRef, useState} from "react";
import {createPortal} from "react-dom";
import styles from "./avatarMenu.module.scss";
import {hasRealAvatar} from "@/lib/avatarFallback";
import {AvatarTooLargeError, deleteAvatarFile, uploadAvatar} from "@/lib/avatarUpload";
import {updateUserProfile} from "@/lib/userData";
import {useAppSelector} from "../../hooks/redux";
import {getText} from "@/store/selectors";
import Preloader from "@/ui/preloader/Preloader";
import FullscreenImage from "@/app/components/fullscreenImage/FullscreenImage";

interface AvatarMenuProps {
    userId: string;
    username: string;
    avatarUrl: string;
    size: number;
    onAvatarChange: (newUrl: string | null) => void;
}

// The own-profile avatar: click opens a dropdown (View/Change/Delete photo)
// anchored below it, modeled directly on header/menu.tsx's ref +
// getBoundingClientRect + portal-to-document.body pattern -- portaling
// sidesteps depending on every ancestor between here and the root never
// acquiring a stacking context of its own.
const AvatarMenu = ({userId, username, avatarUrl, size, onAvatarChange}: AvatarMenuProps) => {
    const {base} = useAppSelector(getText);
    const hasPhoto = hasRealAvatar(avatarUrl);

    const [isActive, setIsActive] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [anchor, setAnchor] = useState({top: 0, left: 0});
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [viewerOpen, setViewerOpen] = useState(false);

    const btnRef = useRef<HTMLButtonElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const openMenu = () => {
        const rect = btnRef.current?.getBoundingClientRect();
        if (rect) {
            setAnchor({top: rect.bottom, left: rect.left});
        }
        setError(null);
        setIsActive(true);
    };

    const closeMenu = () => setIsActive(false);

    const handleViewPhoto = () => {
        closeMenu();
        setViewerOpen(true);
    };

    const handleChangePhoto = () => {
        closeMenu();
        fileInputRef.current?.click();
    };

    const handleFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file) return;

        setIsUploading(true);
        setError(null);

        try {
            const newUrl = await uploadAvatar(userId, file);
            await updateUserProfile(userId, {avatar_url: newUrl});
            // Best-effort -- a no-op for a Google/ui-avatars URL we don't own.
            await deleteAvatarFile(avatarUrl);
            onAvatarChange(newUrl);
        } catch (err) {
            setError(err instanceof AvatarTooLargeError ? base.avatarTooLarge : base.avatarUploadError);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeletePhoto = async () => {
        closeMenu();
        setIsUploading(true);
        try {
            await deleteAvatarFile(avatarUrl);
            await updateUserProfile(userId, {avatar_url: null});
            onAvatarChange(null);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className={styles.avatarMenu}>
            <button ref={btnRef} className={styles.avatarMenu__trigger} onClick={openMenu}>
                <Image src={avatarUrl} width={size} height={size} alt="avatar"/>
            </button>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className={styles.avatarMenu__hiddenInput}
                onChange={handleFileSelected}
            />

            {mounted && createPortal(
                <>
                    <div
                        className={isActive ? styles.avatarMenu__show : styles.avatarMenu__hide}
                        style={{top: anchor.top, left: anchor.left}}
                    >
                        <div className={styles.avatarMenu__content}>
                            {hasPhoto && (
                                <button onClick={handleViewPhoto}>
                                    <span>{base.viewPhoto}</span>
                                </button>
                            )}
                            <button onClick={handleChangePhoto}>
                                <span>{base.changePhoto}</span>
                            </button>
                            {hasPhoto && (
                                <button className={styles.avatarMenu__delete} onClick={handleDeletePhoto}>
                                    <span>{base.deletePhoto}</span>
                                </button>
                            )}
                            {error && <p className={styles.avatarMenu__error}>{error}</p>}
                        </div>
                    </div>
                    <button
                        className={isActive ? styles.shadowActive : styles.shadow}
                        disabled={!isActive}
                        onClick={closeMenu}
                    />
                </>,
                document.body,
            )}

            {viewerOpen && (
                <FullscreenImage src={avatarUrl} alt={username} onClose={() => setViewerOpen(false)}/>
            )}

            {isUploading && <Preloader/>}
        </div>
    );
};

export default AvatarMenu;
