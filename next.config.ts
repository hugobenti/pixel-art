/**
 * Purpose:
 * Next.js configuration for PixelCraft; pins Turbopack root when multiple lockfiles exist upstream.
 */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
