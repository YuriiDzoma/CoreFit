export type User = {
    id: string;
    username: string;
    avatar_url: string;
    created_at: string;
    email: string;
    language: string;
    dark: boolean;
    is_trainer: boolean;
};

export type ProfileType = {
    id: string;
    username: string;
    avatar_url: string;
    created_at: string;
};

export type UserSettings = {
    dark: boolean;
    language: string;
    is_trainer?: boolean;
};
