'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export function useSupabaseSession() {
    const [session, setSession] = useState<any>(null);
    const supabase = createClient();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, [supabase]);

    return session;
}
