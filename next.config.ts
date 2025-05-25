import type { NextConfig } from "next";
import { createCivicAuthPlugin } from "@civic/auth/nextjs"

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
      new URL('https://www.sportslogos.net/logos/**'),
      new URL('https://drive.google.com/file/**')
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};


const withCivicAuth = createCivicAuthPlugin({
  clientId: "968a6503-3167-4af3-9ff4-7387339f60db"
});

export default withCivicAuth(nextConfig)
