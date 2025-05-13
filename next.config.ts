import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL('https://tenor.com/**'),
      new URL('https://randomuser.me/**'),
      new URL('https://cdn-icons-png.flaticon.com/**'),
      new URL('https://media.tenor.com/**'),
      new URL('https://images.unsplash.com/**'),
      new URL('https://randomuser.me/**'),
      new URL('https://lh3.googleusercontent.com/a/**'),
      new URL('https://loodibee.com/wp-content/upload/**'),
      new URL('https://www.sportslogos.net/logos/**')
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
