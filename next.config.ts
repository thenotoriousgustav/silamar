import type { NextConfig } from "next";

// next.config.js
const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
