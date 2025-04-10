'use client';
import React, { useEffect, useState } from 'react';
import styles from './pwaInstallPrompt.module.scss';
import Image from 'next/image';

const PwaInstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        if (dismissed === 'true') return;

        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowBanner(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = () => {
        if (deferredPrompt) {
            (deferredPrompt as any).prompt();
            (deferredPrompt as any).userChoice.then(() => {
                setDeferredPrompt(null);
                setShowBanner(false);
                localStorage.setItem('pwa-install-dismissed', 'true');
            });
        }
    };

    const handleClose = () => {
        setShowBanner(false);
        localStorage.setItem('pwa-install-dismissed', 'true');
    };

    if (!showBanner) return null;

    return (
        <div className={styles.wrapper}>
            <div className={styles.popup}>
                <button className={styles.close} onClick={handleClose}>
                    <Image
                        src="/icons/close.svg"
                        width={24}
                        height={24}
                        alt="close"
                    />
                </button>
                <span>Встановіть CoreFit як додаток</span>
                <button className={styles.button} onClick={handleInstallClick}>
                    Встановити
                </button>
            </div>
        </div>
    );
};

export default PwaInstallPrompt;
