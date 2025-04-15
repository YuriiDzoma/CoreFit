'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export function useSupabaseSession() {
    const [session, setSession] = useState<any>(null);
    const supabase = createClient();

    useEffect(() => {
        // Встановлюємо початкову сесію
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
        });

        // Слухаємо зміни сесії
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, [supabase]);

    return session;
}
