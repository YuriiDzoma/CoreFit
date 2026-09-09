export type User = {
    id: string;
    username: string;
    // Nullable in the DB (a profile can genuinely have none) despite the
    // non-null type further down on ProfileType -- avatar_url needs to be
    // settable back to null here specifically, for deleting a photo
    // (AvatarMenu.tsx) to revert to the generated initials fallback.
    avatar_url: string | null;
    created_at: string;
    email: string;
    language: string;
    dark: boolean;
    is_trainer: boolean;
    // Program Detail's I/II/III view-density tab, mobile-only feature
    // ported here so the choice syncs across a user's devices. Null until
    // the user picks a density at least once.
    program_view_density: number | null;
    city: string | null;
    country: string | null;
    // Heartbeat written roughly every 60s while the app is in the
    // foreground (see AppShell.tsx) -- drives the "Онлайн"/last-seen line
    // on the profile page. Null for any row that predates this column, or
    // that simply hasn't opened the app since.
    last_active_at: string | null;
};

export type ProfileType = {
    id: string;
    username: string;
    avatar_url: string;
    created_at: string;
    // Optional -- most fetchers here (fetchUsers, fetchProfilesByIds) don't
    // select it, but lib/data/user.ts's getProfileById/getOwnProfile
    // already do (needed for trainer-request gating and the city line on
    // the profile page).
    is_trainer?: boolean;
    city?: string | null;
    country?: string | null;
    last_active_at?: string | null;
};

export type UserSettings = {
    dark: boolean;
    language: string;
    is_trainer?: boolean;
    program_view_density: number | null;
    city: string | null;
    country: string | null;
};
