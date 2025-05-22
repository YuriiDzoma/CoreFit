'use client';

import React, { useEffect, useState } from 'react';
import styles from './app.module.scss';
import '../ui/variables.scss';
import Header from './components/header/header';
import Navigation from './components/navigation/navigation';
import StartPreloader from '../ui/startPreloader/startPreloader';
import PwaInstallPrompt from './components/PwaInstallPrompt/pwaInstallPrompt';
import { useAppDispatch } from './hooks/redux';
import { setText } from '@/store/language-slice';
import { setCurrentUserId, setIsDarkTheme } from '@/store/account-slice';
import { getLanguages } from '../lib/languages';
import { useSupabaseSession } from '@/lib/authClient';
import {fetchUserTheme} from "../lib/userData";

const AppShell = ({ children }: { children: React.ReactNode }) => {
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();
    const session = useSupabaseSession();

    useEffect(() => {
        const initApp = async () => {
            const response = await getLanguages('english');
            dispatch(setText(response));

            if (session?.user?.id) {
                dispatch(setCurrentUserId(session.user.id));

                const theme = await fetchUserTheme(session.user.id);
                document.documentElement.setAttribute('data-theme', theme);
                dispatch(setIsDarkTheme(theme === "dark"))
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
            }

            const timer = setTimeout(() => setIsLoading(false), 1000);
            return () => clearTimeout(timer);
        };

        initApp();
    }, [dispatch, session]);

    return (
        <>
            <PwaInstallPrompt />
            <div className={styles.container}>
                <Header session={session} />
                {session && <Navigation />}
                <div className={styles.content}>
                    {isLoading ? <StartPreloader /> : children}
                </div>
            </div>
        </>
    );
};

export default AppShell;
