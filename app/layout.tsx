'use client';
import '../ui/base.scss';
import '../ui/global.css';
import {roboto} from '../ui/fonts';
import styles from "./app.module.scss";
import React, {useEffect, useState} from 'react';
import Header from "./components/header/header";
import Navigation from "./components/navigation/navigation";
import StartPreloader from "../ui/startPreloader/startPreloader";

export default function RootLayout({children,}: { children: React.ReactNode; }) {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);

        const timer = setTimeout(() => setIsLoading(false), 1500);

        return () => clearTimeout(timer);
    }, []);
    return (
        <html lang="en">
        <head>
            <link rel="manifest" href="/manifest.json" />
            <meta name="theme-color" content="#000000" />
            <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />

        </head>
        <body className={`${roboto.className} antialiased`}>
        <div className={styles.container}>
            <Header/>
            {isAuthenticated && <Navigation/>}
            <div className={styles.content}>
                {isLoading ? <StartPreloader/> : children}
            </div>
        </div>
        </body>
        </html>
    );
}
