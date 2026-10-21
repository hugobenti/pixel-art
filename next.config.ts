/**
 * Purpose:
 * Next.js configuration for PixelCraft; pins Turbopack root when multiple lockfiles exist upstream.
 */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  // Isolated production builds (e.g. an agent verifying a change while `next dev` or another
  // build uses .next): `NEXT_DIST_DIR=.next-verify npm run build && NEXT_DIST_DIR=.next-verify npm start`.
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
};

export default nextConfig;
