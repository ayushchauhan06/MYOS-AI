import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Allow server actions to run longer (Apify polling needs ~90s)
    serverActionsBodySizeLimit: "2mb",
  },
  // Increase the function timeout for API routes / server actions
  // (only works on Vercel; locally dev server has no limit)
  serverExternalPackages: [],
};

export default nextConfig;
