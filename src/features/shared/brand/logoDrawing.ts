/**
 * Purpose:
 * The horizontal lockup as SVG rects for the in-app logo, with the theme keys mapped to tokens so the
 * wordmark and the drawn pixel follow the light or dark theme.
 */

import { BRAND_FIXED_COLORS, HORIZONTAL_LOCKUP } from "./brandArt";
import type { IBrandLogoDrawing } from "./BrandLogo.type";
import { lockup } from "./brandPixels";

const UI_COLORS: Readonly<Record<string, string>> = {
  ...BRAND_FIXED_COLORS,
  d: "var(--color-fg)",
  i: "var(--color-fg)",
  h: "var(--color-brand-hb)",
};

const horizontal = lockup(HORIZONTAL_LOCKUP);

export const HORIZONTAL_LOGO: IBrandLogoDrawing = {
  viewBox: `0 0 ${horizontal.width} ${horizontal.height}`,
  rects: horizontal.runs.map((run) => ({
    id: `${run.x}-${run.y}`,
    x: run.x,
    y: run.y,
    width: run.length,
    fill: UI_COLORS[run.key],
  })),
};
