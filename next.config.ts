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
        hostname: "supabase.apfam.com.br",
      },

    ],
  },
  output: 'standalone',
  // typescript: {
  //   ignoreBuildErrors: true,
  // },

};

export default nextConfig;
