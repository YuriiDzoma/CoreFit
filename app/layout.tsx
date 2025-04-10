'use client';
import '../ui/base.scss';
import '../ui/global.css';
import { roboto } from '../ui/fonts';

import { Provider } from 'react-redux';
import { store } from '@/store/store';
import AppShell from "./AppShell";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <head>
            <link rel="manifest" href="/manifest.json" />
            <meta name="theme-color" content="#000000" />
            <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        </head>
        <body className={`${roboto.className} antialiased`}>
        <Provider store={store}>
            <AppShell>{children}</AppShell>
        </Provider>
        </body>
        </html>
    );
}
