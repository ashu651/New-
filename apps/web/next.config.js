/******** Next.js config for Snapzy web ********/
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { typedRoutes: true },
  images: { domains: ['localhost', '127.0.0.1'] }
};

module.exports = nextConfig;