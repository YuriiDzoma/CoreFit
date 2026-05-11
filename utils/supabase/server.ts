import 'server-only';
import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function createServerSupabase() {
    const url  = process.env.SUPABASE_URL  ?? process.env.NEXT_PUBLIC_SUPABASE_URL  ?? '';
    const anon = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
    if (!url || !anon) throw new Error('Missing SUPABASE_URL/ANON_KEY');

    const store = await cookies();

    const set = (name: string, value: string, options?: CookieOptions) => {
        store.set({ name, value, ...(options ?? {}) } as any);
    };

    const remove = (name: string, options?: CookieOptions) => {
        store.delete({ name, ...(options ?? {}) } as any);
    };

    return createServerClient(url, anon, {
        cookies: {
            get(name: string) {
                return store.get(name)?.value;
            },
            set,
            remove,
        },
    });
}
