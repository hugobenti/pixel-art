/**
 * Purpose:
 * Root `viewport` export: browser chrome color (`theme-color`) matching each theme's `bg` token.
 *
 * Notes:
 * Next.js renders static meta tags, so the colors are read from globals.css on the server (the single
 * token source) and follow `prefers-color-scheme`. A theme picked explicitly in settings that differs
 * from the OS scheme keeps the OS scheme's chrome color.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { Viewport } from "next";

import { readSelectorColors, readThemeColors } from "@/features/shared/utils/colorContrast";

const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

export const siteViewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: readThemeColors(css).bg },
    {
      media: "(prefers-color-scheme: dark)",
      color: readSelectorColors(css, '[data-theme="dark"]').bg,
    },
  ],
};
