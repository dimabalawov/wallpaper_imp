import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "projecty.local",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/**",
      },
    ],
    // Enable this for local development with Local by Flywheel/MAMP/etc
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;