import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  allowedDevOrigins: ["192.168.29.87", "localhost:3000"],
  experimental: {
    viewTransition: true,
  },
};

export default nextConfig;

