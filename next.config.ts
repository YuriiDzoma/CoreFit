import withPWA from 'next-pwa';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: true,
    // інші опції...
};

export default withPWA({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
})(nextConfig);
