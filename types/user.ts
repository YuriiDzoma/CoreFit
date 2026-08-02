export type User = {
    id: string;
    username: string;
    avatar_url: string;
    created_at: string;
    email: string;
    language: string;
    dark: boolean;
    is_trainer: boolean;
    // Program Detail's I/II/III view-density tab, mobile-only feature
    // ported here so the choice syncs across a user's devices. Null until
    // the user picks a density at least once.
    program_view_density: number | null;
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
    program_view_density: number | null;
};
