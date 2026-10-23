/**
 * Purpose:
 * Web app manifest: name, colors from the light tokens, and the generated pencil-end icons.
 *
 * Notes:
 * The 512 tile keeps the whole icon inside the central 80% circle, so it doubles as the maskable icon.
 */
import type { MetadataRoute } from "next";

import { site } from "@/content/site";

import { lightTokens } from "./themeTokens";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.name,
    description: site.description,
    start_url: "/gallery",
    display: "standalone",
    background_color: lightTokens.bg,
    theme_color: lightTokens.bg,
    icons: [
      { src: "/icon/192", sizes: "192x192", type: "image/png" },
      { src: "/icon/512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon/512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
