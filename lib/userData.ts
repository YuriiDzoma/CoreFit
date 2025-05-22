import { createClient } from '@/utils/supabase/client';
import {ProfileType, User} from "../types/user";

export const fetchUsers = async (): Promise<ProfileType[]> => {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, created_at');

    if (error) {
        console.error('Error fetching users:', error);
        return [];
    }

    return data ?? [];
};



export const fetchUserProfileById = async (id: string): Promise<ProfileType | null> => {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, created_at')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching profile by ID:', error);
        return null;
    }

    return data ?? null;
};


export const fetchOwnProfile = async (): Promise<ProfileType | null> => {
    const supabase = createClient();
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user) return null;
    return fetchUserProfileById(user.id);
};

export const fetchUserTheme = async (id: string): Promise<'dark' | 'light'> => {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('profiles')
        .select('isDarkTheme')
        .eq('id', id)
        .single();

    if (error || data?.isDarkTheme === undefined) {
        console.warn('Fallback to dark theme due to missing isDarkTheme');
        return 'dark'; // fallback
    }

    return data.isDarkTheme ? 'dark' : 'light';
};
