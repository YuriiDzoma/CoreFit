import { createClient } from '@/utils/supabase/client';
import {ProfileType, User, UserSettings} from "../types/user";

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
        .select('dark, language, is_trainer, program_view_density, city, country')
        .eq('id', userId)
        .single();

    if (error || !data) {
        console.warn('Failed to fetch user settings, fallback applied', error);
        return {
            dark: true,
            language: 'english',
            is_trainer: false, // ✅ дефолт
            program_view_density: null,
            city: null,
            country: null,
        };
    }

    return {
        dark: data.dark ?? true,
        language: data.language ?? 'english',
        is_trainer: data.is_trainer ?? false, // ✅ беремо з профілю
        program_view_density: data.program_view_density ?? null,
        city: data.city ?? null,
        country: data.country ?? null,
    };
};


export const updateUserProfile = async (
    userId: string,
    updates: Partial<Pick<User, 'username' | 'language' | 'dark' | 'email' | 'is_trainer' | 'program_view_density' | 'city' | 'country'>>
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

export type SignUpStatus = 'signed-in' | 'confirmation-required' | 'already-registered';

// Matches the mobile app's own signUpWithPassword (src/lib/supabase/auth.ts)
// exactly, including its own detection comment for the identities-array
// trick -- Supabase's `signUp` never returns an error for an email that
// already belongs to a confirmed account (deliberate, anti-enumeration),
// so `data.session === null` alone doesn't distinguish "genuinely new,
// pending confirmation" from "this account already exists." Confirmed
// live against this project's own data before writing this: a real user
// retrying signup with their already-Google-linked email landed on a
// silent "success" here previously, then couldn't log in, with no
// confirmation email actually sent for that case either.
export const registerUserWithEmail = async (
    fullName: string,
    email: string,
    password: string
): Promise<{ error?: string; status?: SignUpStatus }> => {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}`
            },
        },
    });

    if (error) return { error: error.message };
    if (data.session) return { status: 'signed-in' };
    if (data.user?.identities?.length === 0) return { status: 'already-registered' };
    return { status: 'confirmation-required' };
};


export const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        console.error("Login failed:", error.message);
        return { success: false, error: error.message };
    }

    return { success: true };
};

