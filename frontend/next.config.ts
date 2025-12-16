import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // @ts-expect-error - eslint config is valid but missing from types in this version
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: "/gifs/:path*",
        destination: process.env.STORAGE_INTERNAL_ENDPOINT || "http://minio:9000/gifs/:path*",
      },
      {
        source: "/api/:path*",
        destination: process.env.API_INTERNAL_ENDPOINT || "http://backend:4000/:path*",
      },
    ];
  },
};

export default nextConfig;
