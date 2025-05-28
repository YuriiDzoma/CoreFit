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
import {setCurrentUserId, setIsDarkTheme, setLanguage} from '@/store/account-slice';
import {getLanguages} from '../lib/languages';
import {useSupabaseSession} from '@/lib/authClient';
import { fetchUserSettings } from "../lib/userData";


const AppShell = ({children}: { children: React.ReactNode }) => {
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();
    const session = useSupabaseSession();

    useEffect(() => {
        const initApp = async () => {
            let lang = 'eng';
            let theme = 'dark';

            if (session?.user?.id) {
                const userId = session.user.id;

                dispatch(setCurrentUserId(userId));

                const settings = await fetchUserSettings(userId);

                lang = settings.language;
                theme = settings.dark ? 'dark' : 'light';

                document.documentElement.setAttribute('data-theme', theme);
                dispatch(setIsDarkTheme(settings.dark));
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
            }

            const response = await getLanguages(lang);
            dispatch(setLanguage(lang));
            dispatch(setText(response));

            const timer = setTimeout(() => setIsLoading(false), 1000);
            return () => clearTimeout(timer);
        };

        initApp();
    }, [dispatch, session]);

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
