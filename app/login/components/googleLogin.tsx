'use client';
import { createClient } from '@/utils/supabase/client';
import React from "react";

export default function GoogleLogin() {
    const handleLogin = async () => {
        const supabase = createClient();
        await supabase.auth.signInWithOAuth({
            provider: 'google',
        });
    };

    return <button type={'button'} onClick={handleLogin}>Увійти через Google</button>;
}
