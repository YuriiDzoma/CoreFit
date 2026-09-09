// @ts-check
const withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
});

// Derived from the same env var every Supabase client call already uses,
// rather than hardcoding the project ref -- so this can't drift out of
// sync with whichever project the app is actually pointed at.
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
    : null;

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    productionBrowserSourceMaps: false,
    images: {
        domains: [
            'ui-avatars.com',
            'lh3.googleusercontent.com',
            // User-uploaded avatars (Storage `avatars` bucket) -- see
            // lib/avatarUpload.ts.
            ...(supabaseHost ? [supabaseHost] : []),
        ],
    },
};


module.exports = withPWA(nextConfig);
