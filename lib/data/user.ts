import { createServerSupabase } from '@/utils/supabase/server';
import type { ProfileType } from '@/types/user';

export async function getOwnProfile(): Promise<ProfileType | null> {
    const sb = await createServerSupabase();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return null;

    const { data } = await sb
        .from('profiles')
        .select('id, username, avatar_url, created_at, dark, language, is_trainer')
        .eq('id', user.id)
        .maybeSingle();

    return (data as ProfileType) ?? null;
}

export async function getProfileById(id: string): Promise<ProfileType | null> {
    const sb = await createServerSupabase();
    const { data } = await sb
        .from('profiles')
        .select('id, username, avatar_url, created_at, dark, language, is_trainer')
        .eq('id', id)
        .maybeSingle();

    return (data as ProfileType) ?? null;
}
