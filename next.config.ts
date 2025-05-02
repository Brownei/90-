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
     
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
