'use client';
import { createClient } from '@/utils/supabase/client';
import React from 'react';
import Image from "next/image";
import styles from './login.module.scss'

export default function GoogleLogin() {
    const handleLogin = async () => {
        const redirectTo =
            process.env.NODE_ENV === 'development'
                ? 'http://localhost:3000'
                : 'https://core-fit-ua.vercel.app';

        const supabase = createClient();
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectTo
            },
        });
    };

    return (
        <button className={`${styles.googleAuth} button`} type="button" onClick={handleLogin}>
            <Image
                src="/icons/googleIcon.svg"
                width={24}
                height={24}
                alt="Screenshots of the dashboard project showing desktop version"
            />
             <span>Auth with Google</span>
        </button>
    );
}
