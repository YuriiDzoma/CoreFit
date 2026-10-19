// @ts-check
const withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    // Pulls public/push-handlers.js's `push`/`notificationclick` listeners
    // into the generated service worker alongside its existing (unedited)
    // caching routes -- see that file's own comment for why this is an
    // `importScripts` addition rather than a custom InjectManifest source.
    importScripts: ['/push-handlers.js'],
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
