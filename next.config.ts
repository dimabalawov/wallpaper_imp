import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "projecty.local",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;