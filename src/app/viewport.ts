/**
 * Purpose:
 * Root `viewport` export: browser chrome color (`theme-color`) matching each theme's `bg` token.
 *
 * Notes:
 * Next.js renders static meta tags, so the colors are read from globals.css on the server (the single
 * token source) and follow `prefers-color-scheme`. A theme picked explicitly in settings that differs
 * from the OS scheme keeps the OS scheme's chrome color.
 */
import type { Viewport } from "next";

import { darkTokens, lightTokens } from "./themeTokens";

export const siteViewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: lightTokens.bg },
    { media: "(prefers-color-scheme: dark)", color: darkTokens.bg },
  ],
};
