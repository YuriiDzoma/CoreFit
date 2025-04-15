'use client';
import { createClient } from '@/utils/supabase/client';
import React from "react";

export default function GoogleLogin() {
    const handleLogin = async () => {
        const redirectTo =
            process.env.NODE_ENV === 'production'
                ? 'https://core-fit-ua.vercel.app/auth/callback'
                : 'http://localhost:3000/auth/callback';

        const supabase = createClient();
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo },
        });
    };

    return (
        <button type="button" onClick={handleLogin}>
            Увійти через Google
        </button>
    );
}
