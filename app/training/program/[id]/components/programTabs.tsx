'use client';

import styles from './programDetail.module.scss'
import React, {useEffect, useState} from "react";
import {useAppSelector} from "../../../../hooks/redux";
import {getText} from "../../../../../store/selectors";

interface ProgramTabsTypes {
    activeTab: number,
    setActiveTab: (value: number) => void,
}

const ImageIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <path d="M21 15l-5-5L5 21"/>
    </svg>
);

const TextIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="6" x2="20" y2="6"/>
        <line x1="4" y1="12" x2="20" y2="12"/>
        <line x1="4" y1="18" x2="14" y2="18"/>
    </svg>
);

const RotateIcon = () => (
    <svg width="22" height="20" viewBox="0 0 24 22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="8" height="14" rx="1.5"/>
        <rect x="13" y="6" width="10" height="7" rx="1.3"/>
        <path d="M9.5 9c1-2 2.5-3.3 4-3.8"/>
        <path d="M12 4.2l1.7 1-1 1.9"/>
    </svg>
);

// `lock`/`unlock` are absent from TS's own DOM lib -- the Screen
// Orientation *Lock* API never made it into a standard these types are
// generated from, unlike the (widely-supported) read-only orientation
// info it's bundled with. Chromium-on-Android is the only place it
// actually exists at runtime: iOS Safari (and desktop Safari) never
// implemented it at all, so `lock` being present here is a real
// capability check, not just a formality -- on iOS this is always
// undefined, and the fallback hint is the only thing the button can do.
type LockableScreenOrientation = ScreenOrientation & {
    lock?: (orientation: 'landscape' | 'portrait') => Promise<void>;
    unlock?: () => void;
};

function getOrientation(): LockableScreenOrientation | undefined {
    return typeof screen !== 'undefined' ? (screen as Screen & { orientation?: LockableScreenOrientation }).orientation : undefined;
}

const ProgramTabs = ({activeTab, setActiveTab}: ProgramTabsTypes) => {
    const {training} = useAppSelector(getText);
    const [showRotateHint, setShowRotateHint] = useState(false);

    // Releases the lock the moment this screen is left (route change or
    // unmount) -- without this, a phone locked into landscape here would
    // stay locked into landscape on every other page too, since the lock
    // is a device/tab-wide setting, not scoped to this component on its
    // own.
    useEffect(() => {
        return () => {
            getOrientation()?.unlock?.();
        };
    }, []);

    const handleRotate = async () => {
        const orientation = getOrientation();

        if (!orientation?.lock) {
            setShowRotateHint(true);
            return;
        }

        try {
            await orientation.lock('landscape');
        } catch {
            // Some Chromium builds only allow locking while the page is
            // in fullscreen, or refuse for other reasons -- same fallback
            // as the "unsupported at all" case above either way.
            setShowRotateHint(true);
        }
    };

    useEffect(() => {
        if (!showRotateHint) return;
        const timer = setTimeout(() => setShowRotateHint(false), 4000);
        return () => clearTimeout(timer);
    }, [showRotateHint]);

    return (
        <div className={styles.tabBoxWrap}>
            <div className={styles.tabBox}>
                <div className={styles.tab}>
                    <p><ImageIcon/></p>
                    <input
                        checked={activeTab === 1}
                        onChange={() => setActiveTab(1)}
                        name={'tabs'}
                        type="radio"
                        aria-label={training.programViewIcons}
                    />
                </div>
                <div className={styles.tab}>
                    <p><TextIcon/></p>
                    <input
                        // A legacy program_view_density of 3 (the removed
                        // third density option) still needs to land on
                        // this button, not neither -- it always rendered
                        // as text, same as this one.
                        checked={activeTab !== 1}
                        onChange={() => setActiveTab(2)}
                        name={'tabs'}
                        type="radio"
                        aria-label={training.programViewText}
                    />
                </div>
                <div className={styles.tab}>
                    <button
                        type="button"
                        className={styles.rotateButton}
                        onClick={handleRotate}
                        aria-label={training.rotateScreen}
                    >
                        <RotateIcon/>
                    </button>
                    {/* Anchored to this specific tab (which is already
                        `position: relative`), not the row as a whole -- a
                        3-second text-only hint below the whole tab bar was
                        easy to miss entirely, reading as "the button does
                        nothing" rather than "unsupported here, try
                        manually". A bubble pinned right under the button
                        that was actually tapped is a much harder miss. */}
                    {showRotateHint && <span className={styles.rotateHint}>{training.rotateHint}</span>}
                </div>
            </div>
        </div>
    )
}

export default ProgramTabs;
