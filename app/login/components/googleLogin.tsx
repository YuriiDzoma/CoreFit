'use client';
import { createClient } from '@/utils/supabase/client';
import React from "react";

export default function GoogleLogin() {
    const handleLogin = async () => {
        const redirectTo =
            typeof window !== 'undefined' && window.location.origin
                ? `${window.location.origin}`
                : 'https://core-fit-ua.vercel.app';
        const supabase = createClient();
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo,
            },
        });
    };

    return <button type={'button'} onClick={handleLogin}>Увійти через Google ТЕСТ</button>;
}
