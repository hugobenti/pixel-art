/**
 * Purpose:
 * App icons generated from the pencil-end grid: favicons (16, 32, 48) and PWA tiles (192, 512),
 * served as `/icon/{size}` and linked from every page.
 */
import { ICON_SIZES, iconImage } from "@/features/shared/brand/brandImageLayout";
import { renderBrandImage } from "@/features/shared/brand/renderBrandImage";

import { lightTokens } from "./themeTokens";

export const contentType = "image/png";

export function generateImageMetadata() {
  return ICON_SIZES.map((size) => ({ id: String(size), size: { width: size, height: size }, contentType }));
}

export default async function Icon({ id }: { id: Promise<string | number> }) {
  return renderBrandImage(iconImage(Number(await id), lightTokens.surface));
}
