import { createClient } from '@/utils/supabase/client';
import {ProfileType, User} from "../types/user";

type UserSettings = {
    isDarkTheme: boolean;
    language: string;
};

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

export const fetchUserSettings = async (userId: string): Promise<UserSettings> => {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('profiles')
        .select('isDarkTheme, language')
        .eq('id', userId)
        .single();

    if (error || !data) {
        console.warn('Failed to fetch user settings, fallback applied', error);
        return {
            isDarkTheme: true,
            language: 'english',
        };
    }

    return {
        isDarkTheme: data.isDarkTheme ?? true,
        language: data.language ?? 'english',
    };
};

export const toggleThemeInDB = async (userId: string, currentTheme: boolean): Promise<boolean> => {
    const supabase = createClient();

    const { error } = await supabase
        .from('profiles')
        .update({ isDarkTheme: !currentTheme })
        .eq('id', userId);

    if (error) {
        console.error('Failed to toggle theme in DB:', error);
        return currentTheme; // повертаємо поточну, якщо не вдалось
    }

    return !currentTheme;
};

export const updateUserLanguage = async (userId: string, language: string): Promise<boolean> => {
    const supabase = createClient();
    const { error } = await supabase
        .from('profiles')
        .update({ language })
        .eq('id', userId);

    if (error) {
        console.error('Error updating language:', error);
        return false;
    }

    return true;
};
