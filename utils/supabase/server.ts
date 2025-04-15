'use server';

import { cookies as getCookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { CookieOptions } from '@supabase/ssr';
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

export const createClient = () => {
    const cookieStore = getCookies() as unknown as ReadonlyRequestCookies;

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options?: CookieOptions) {
                    cookieStore.set({ name, value, ...options });
                },
                remove(name: string, options?: CookieOptions) {
                    cookieStore.delete({ name, ...options });
                },
            },
        }
    );
};
