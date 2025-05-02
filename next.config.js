/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['pbs.twimg.com', 'abs.twimg.com', 'images.unsplash.com', 'randomuser.me'],
  },
  // Use webpack fallbacks for browser compatibility
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
// @ts-ignore
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;