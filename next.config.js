// @ts-check
const withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    productionBrowserSourceMaps: false,
};


module.exports = withPWA(nextConfig);
