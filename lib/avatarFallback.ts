// Same ui-avatars.com initials image already generated at signup
// (userData.ts) and used by Profile.client.tsx for a missing avatar_url.
// Centralized here so the onError fallback added to every avatar-rendering
// call site (records, friends, requests, users, trainer clients, nav,
// training history) constructs the same URL the same way.
export function avatarFallbackUrl(name?: string | null): string {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || '?')}`;
}
