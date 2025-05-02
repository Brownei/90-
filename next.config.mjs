/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { hostname: 'tenor.com' },
      { hostname: 'pbs.twimg.com' },
      { hostname: 'abs.twimg.com' },
      { hostname: 'cdn.discordapp.com' },
      { hostname: 'images.unsplash.com' },
      { hostname: 'randomuser.me' },
    ],
  },
};

export default nextConfig; 