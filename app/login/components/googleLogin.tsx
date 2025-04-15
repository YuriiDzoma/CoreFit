'use client';
import { createClient } from '@/utils/supabase/client';
import React from "react";

export default function GoogleLogin() {
    const handleLogin = async () => {
        const supabase = createClient();
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}`, // або хардкод: 'https://core-fit-ua.vercel.app'
            },
        });
    };

    return (
        <button type="button" onClick={handleLogin}>
            Увійти через Google
        </button>
    );
}
