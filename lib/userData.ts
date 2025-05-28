import { createClient } from '@/utils/supabase/client';
import {ProfileType, User} from "../types/user";

type UserSettings = {
    dark: boolean;
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
        .select('dark, language')
        .eq('id', userId)
        .single();

    if (error || !data) {
        console.warn('Failed to fetch user settings, fallback applied', error);
        return {
            dark: true,
            language: 'english',
        };
    }

    return {
        dark: data.dark ?? true,
        language: data.language ?? 'english',
    };
};

export const updateUserProfile = async (
    userId: string,
    updates: Partial<Pick<User, 'username' | 'language' | 'dark' | 'email'>>
): Promise<User | null> => {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

    if (error) {
        console.error('Error updating profile:', error);
        return null;
    }

    return data as User;
};

export const fetchProfilesByIds = async (ids: string[]): Promise<Record<string, ProfileType>> => {
    if (ids.length === 0) return {};

    const supabase = createClient();
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('id', ids);

    if (error || !data) {
        console.error('❌ Error fetching multiple profiles:', error);
        return {};
    }

    return Object.fromEntries(data.map((u) => [u.id, u]));
};

export const fetchLimitedFriendProfiles = async (friendIds: string[], limit = 12): Promise<ProfileType[]> => {
    if (friendIds.length === 0) return [];

    const supabase = createClient();
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('id', friendIds)
        .limit(limit);

    if (error) {
        console.error('❌ Error fetching limited profiles:', error);
        return [];
    }

    return data ?? [];
};

export const registerUserWithEmail = async (
    fullName: string,
    email: string,
    password: string
): Promise<{ error?: string }> => {
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                avatar_url: ``
            },
        },
    });

    if (error) return { error: error.message };

    return {};
};


