// Same ui-avatars.com initials image already generated at signup
// (userData.ts) and used by Profile.client.tsx for a missing avatar_url.
// Centralized here so the onError fallback added to every avatar-rendering
// call site (records, friends, requests, users, trainer clients, nav,
// training history) constructs the same URL the same way.
//
// `format=png` is load-bearing, not cosmetic -- ui-avatars.com defaults to
// SVG, and Next's image optimizer rejects remote SVGs by default (400
// "image type is not allowed", no `dangerouslyAllowSVG` set here). Any
// caller passing this through `next/image` -- which is now all of them,
// for the same reason `next/image` was adopted in the first place (see
// Sprint 82) -- would otherwise 400 on every account with no real photo.
export function avatarFallbackUrl(name?: string | null): string {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || '?')}&format=png`;
}

// A profile always has *some* avatar_url (a real photo, or this generated
// fallback) -- this distinguishes the two, for anything that should only
// apply to a genuine photo (the fullscreen viewer, the "Видалити фото"
// menu option).
export function hasRealAvatar(url?: string | null): boolean {
    return Boolean(url) && !url!.includes('ui-avatars.com');
}
