import type { NextConfig } from "next";

const nextConfig = {
  serverExternalPackages: ["pdf-parse"], // Next.js 15
  serverComponentsExternalPackages: ["pdf-parse"],
};

export default nextConfig;
