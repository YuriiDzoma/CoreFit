'use client';
import { createClient } from '@/utils/supabase/client';
import React from 'react';

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
        <button type="button" onClick={handleLogin}>
            Увійти через Google
        </button>
    );
}
