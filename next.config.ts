import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "https",
        hostname: "wallpapers.com",
      },
      {
        protocol: "https",
        hostname: "bmoghybiddxohxacuotp.supabase.co",
      },
    ],
  },
  output: 'standalone',
  // typescript: {
  //   ignoreBuildErrors: true,
  // },

};

export default nextConfig;
