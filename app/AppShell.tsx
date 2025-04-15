'use client';

import React, { useEffect, useState } from 'react';
import styles from './app.module.scss';
import Header from './components/header/header';
import Navigation from './components/navigation/navigation';
import StartPreloader from '../ui/startPreloader/startPreloader';
import PwaInstallPrompt from './components/PwaInstallPrompt/pwaInstallPrompt';
import { useAppDispatch } from './hooks/redux';
import { setText } from '@/store/language-slice';
import { getLanguages } from './settings/languages';
import { useSupabaseSession } from '@/lib/authClient';

const AppShell = ({ children }: { children: React.ReactNode }) => {
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();
    const session = useSupabaseSession();

    useEffect(() => {
        const fetchLanguages = async () => {
            const response = await getLanguages('english');
            dispatch(setText(response));
        };
        fetchLanguages();

        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, [dispatch]);

    return (
        <>
            <PwaInstallPrompt />
            <div className={styles.container}>
                <Header session={session} />
                {session && <Navigation />} {/* ✅ показувати тільки якщо є сесія */}
                <div className={styles.content}>
                    {isLoading ? <StartPreloader /> : children}
                </div>
            </div>
        </>
    );
};

export default AppShell;
