import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["images.unsplash.com", "pub-7fe7b3b0f54e4539a4aa2e06b665f86c.r2.dev"],
  },
};

export default nextConfig;
