/** @type {import('next').NextConfig} */
 const { createCivicAuthPlugin } = require("@civic/auth/nextjs")
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['pbs.twimg.com', 'lh3.googleusercontent.com', 'abs.twimg.com', 'images.unsplash.com', 'randomuser.me', 'loodibee.com', 'www.sportslogos.net', 'drive.google.com'],
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
const withCivicAuth = createCivicAuthPlugin({
  clientId: "968a6503-3167-4af3-9ff4-7387339f60db"
});

module.exports = withCivicAuth(nextConfig);
