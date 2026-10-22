/**
 * Purpose:
 * Apple touch icon: the pencil end centered on an opaque surface tile, 180 × 180.
 */
import { iconImage } from "@/features/shared/brand/brandImageLayout";
import { renderBrandImage } from "@/features/shared/brand/renderBrandImage";

import { lightTokens } from "./themeTokens";

const APPLE_ICON_SIZE = 180;

export const size = { width: APPLE_ICON_SIZE, height: APPLE_ICON_SIZE };
export const contentType = "image/png";

export default function AppleIcon() {
  return renderBrandImage(iconImage(APPLE_ICON_SIZE, lightTokens.surface));
}
