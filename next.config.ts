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
        protocol: "http",
        hostname: "*.212.85.12.178.sslip.io",
      },
      {
        protocol: "https",
        hostname: "*.212.85.12.178.sslip.io",
      },

    ],
  },
  output: 'standalone',
  // typescript: {
  //   ignoreBuildErrors: true,
  // },

};

export default nextConfig;
