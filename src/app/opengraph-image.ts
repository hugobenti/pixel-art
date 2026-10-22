/**
 * Purpose:
 * Social preview image (1200 × 630): the brand pencil on a paper grid with the product description.
 *
 * Notes:
 * `next/og` needs the font file itself (TTF), so the caption's Schibsted Grotesk SemiBold ships next
 * to the brand art (SIL Open Font License, see fonts/OFL.txt).
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { site } from "@/content/site";
import { OG_SIZE, ogImage } from "@/features/shared/brand/brandImageLayout";
import { renderBrandImage } from "@/features/shared/brand/renderBrandImage";

import { lightTokens } from "./themeTokens";

const CAPTION_FONT = "Schibsted Grotesk";
const CAPTION_FONT_FILE = "src/features/shared/brand/fonts/SchibstedGrotesk-SemiBold.ttf";

export const alt = site.description;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const font = await readFile(join(process.cwd(), CAPTION_FONT_FILE));
  const image = ogImage({
    paper: lightTokens.bg,
    gridLine: lightTokens.line,
    captionColor: lightTokens["fg-secondary"],
    caption: site.description,
    fontFamily: CAPTION_FONT,
  });
  return renderBrandImage(image, {
    fonts: [{ name: CAPTION_FONT, data: font, weight: 600, style: "normal" }],
  });
}
