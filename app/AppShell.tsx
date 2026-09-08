'use client';

import React, {useEffect, useState} from 'react';
import styles from './app.module.scss';
import '../ui/variables.scss';

import Header from './components/header/header';
import Navigation from './components/navigation/navigation';
import StartPreloader from '../ui/startPreloader/startPreloader';
import PwaInstallPrompt from './components/PwaInstallPrompt/pwaInstallPrompt';

import {useAppDispatch} from './hooks/redux';
import {setText} from '@/store/language-slice';
import {setCurrentUserId, setIsDarkTheme, setLanguage, setProgramViewDensity} from '@/store/account-slice';

import {getLanguages} from '../lib/languages';
import {useSupabaseSession} from '@/lib/authClient';
import {fetchUserSettings, updateUserProfile} from '../lib/userData';
import {getDefaultLanguageByRegion, AppLanguage} from '../lib/defaultLanguage';

const START_PRELOADER_DELAY = 1000;
const LANGUAGE_STORAGE_KEY = 'app_language';
const LAST_ACTIVE_HEARTBEAT_MS = 60_000;

function touchLastActive(userId: string) {
    updateUserProfile(userId, {last_active_at: new Date().toISOString()}).catch(() => {});
}

const isAppLanguage = (value?: string | null): value is AppLanguage => {
    return value === 'eng' || value === 'rus' || value === 'ukr' || value === 'pl';
};

const getStoredLanguage = (): AppLanguage | null => {
    if (typeof window === 'undefined') return null;

    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);

    return isAppLanguage(storedLanguage) ? storedLanguage : null;
};

const AppShell = ({children}: { children: React.ReactNode }) => {
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();
    const session = useSupabaseSession();

    useEffect(() => {
        let isMounted = true;
        let timer: ReturnType<typeof setTimeout> | null = null;

        const initApp = async () => {
            setIsLoading(true);

            const defaultLanguage = getDefaultLanguageByRegion();
            const storedLanguage = getStoredLanguage();

            let lang: AppLanguage = storedLanguage || defaultLanguage;
            let isDarkTheme = true;
            // `2` until the user picks a density at least once — always
            // dispatched below (never conditionally skipped) for the same
            // reason `isDarkTheme` always is: switching to a different user
            // on the same device must overwrite whatever the previous
            // user's density was, not leave it stale in the store.
            let viewDensity = 2;

            try {
                if (session?.user?.id) {
                    const userId = session.user.id;

                    dispatch(setCurrentUserId(userId));

                    const settings = await fetchUserSettings(userId);

                    if (isAppLanguage(settings?.language)) {
                        lang = settings.language;
                        localStorage.setItem(LANGUAGE_STORAGE_KEY, settings.language);
                    }

                    isDarkTheme = Boolean(settings?.dark);
                    viewDensity = settings?.program_view_density ?? 2;
                }

                const theme = isDarkTheme ? 'dark' : 'light';

                document.documentElement.setAttribute('data-theme', theme);

                dispatch(setIsDarkTheme(isDarkTheme));
                dispatch(setLanguage(lang));
                dispatch(setText(getLanguages(lang)));
                dispatch(setProgramViewDensity(viewDensity));
            } catch (error) {
                console.log('Error initializing app:', error);

                document.documentElement.setAttribute('data-theme', 'dark');

                dispatch(setIsDarkTheme(true));
                dispatch(setLanguage(lang));
                dispatch(setText(getLanguages(lang)));
                dispatch(setProgramViewDensity(2));
            } finally {
                timer = setTimeout(() => {
                    if (isMounted) {
                        setIsLoading(false);
                    }
                }, START_PRELOADER_DELAY);
            }
        };

        initApp();

        return () => {
            isMounted = false;

            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [dispatch, session?.user?.id]);

    // Heartbeat for the "Онлайн"/last-seen line on profile pages (see
    // lib/lastActive.ts) -- a plain polled timestamp, not a live socket.
    // The interval only runs while the tab is visible, so a backgrounded
    // tab stops extending its own "online" window; regaining visibility
    // touches immediately rather than waiting for the next tick.
    useEffect(() => {
        const userId = session?.user?.id;
        if (!userId) return;

        let interval: ReturnType<typeof setInterval> | null = null;

        const start = () => {
            touchLastActive(userId);
            interval = setInterval(() => touchLastActive(userId), LAST_ACTIVE_HEARTBEAT_MS);
        };

        const stop = () => {
            if (interval) clearInterval(interval);
            interval = null;
        };

        if (document.visibilityState === 'visible') start();

        const onVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                if (!interval) start();
            } else {
                stop();
            }
        };

        document.addEventListener('visibilitychange', onVisibilityChange);

        return () => {
            stop();
            document.removeEventListener('visibilitychange', onVisibilityChange);
        };
    }, [session?.user?.id]);

    return (
        <>
            <PwaInstallPrompt/>

            <div className={styles.container}>
                <Header session={session}/>

                {session && <Navigation/>}

                <div className={styles.content}>
                    {isLoading ? <StartPreloader/> : children}
                </div>
            </div>
        </>
    );
};

export default AppShell;