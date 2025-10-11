import 'server-only';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function createServerSupabase(): Promise<SupabaseClient> {
    const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error('Missing SUPABASE_URL/ANON_KEY');

    const cookieStore = await cookies();

    return createServerClient(url, key, {
        cookies: {
            get(name: string) {
                return cookieStore.get(name)?.value;
            },
            set(name: string, value: string, options?: any) {
                cookieStore.set(name, value, options);
            },
            remove(name: string, options?: any) {
                cookieStore.set(name, '', { ...options, maxAge: 0 });
            },
        },
    });
}
