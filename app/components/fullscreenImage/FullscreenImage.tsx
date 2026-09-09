'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './fullscreenImage.module.scss';

interface FullscreenImageProps {
    src: string;
    alt: string;
    onClose: () => void;
}

// Plain <img>, not next/image -- this shows one image at whatever aspect
// ratio it has, sized to fit the viewport via object-fit, which doesn't
// benefit from next/image's responsive-srcset optimization the way a
// fixed-layout thumbnail does.
export default function FullscreenImage({ src, alt, onClose }: FullscreenImageProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [onClose]);

    if (!mounted) return null;

    return createPortal(
        <div className={styles.backdrop} onClick={onClose}>
            <button className={styles.close} onClick={onClose} aria-label="Close">
                ✕
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={src}
                alt={alt}
                className={styles.image}
                onClick={(event) => event.stopPropagation()}
            />
        </div>,
        document.body,
    );
}
