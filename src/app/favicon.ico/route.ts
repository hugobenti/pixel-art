/**
 * Purpose:
 * `/favicon.ico` for clients that request it directly: the pencil end at 16, 32 and 48 px, packed
 * from the same generated PNGs as the linked icons. Built once at build time.
 */
import { iconImage } from "@/features/shared/brand/brandImageLayout";
import { buildIco } from "@/features/shared/brand/ico";
import { renderBrandImage } from "@/features/shared/brand/renderBrandImage";

import { lightTokens } from "../themeTokens";

const FAVICON_SIZES = [16, 32, 48];

export const dynamic = "force-static";

export async function GET() {
  const images = await Promise.all(
    FAVICON_SIZES.map(async (size) => {
      const png = await renderBrandImage(iconImage(size, lightTokens.surface)).arrayBuffer();
      return { size, png: new Uint8Array(png) };
    }),
  );
  return new Response(buildIco(images), { headers: { "Content-Type": "image/x-icon" } });
}
