'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

// `useSupabaseSession`'s own `onAuthStateChange` subscription (below)
// reacts to this automatically everywhere it's used (Header, AppShell) --
// no manual state reset needed here, same as the mobile app's own
// `auth-store.ts` `signOut`, which is similarly just the raw Supabase call.
export async function signOut(): Promise<void> {
    const supabase = createClient();
    await supabase.auth.signOut();
}

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
