/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['firebasestorage.googleapis.com', 'storage.googleapis.com'],
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        unoptimized: process.env.NODE_ENV === 'development',
    },
    experimental: {
        optimizePackageImports: ['framer-motion', 'firebase', '@heroicons/react'],
    },
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },
    swcMinify: true,
    compress: true,
    poweredByHeader: false,
    reactStrictMode: true,
    trailingSlash: false,
};

module.exports = nextConfig;