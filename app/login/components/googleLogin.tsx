'use client';
import { createClient } from '@/utils/supabase/client';
import React from 'react';

export default function GoogleLogin() {
    const handleLogin = async () => {
        const supabase = createClient();
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: 'https://core-fit-ua.vercel.app', // жорстко, без `${window.location.origin}`
            },
        });
    };

    return (
        <button type="button" onClick={handleLogin}>
            Увійти через Google
        </button>
    );
}
