/**
 * Purpose:
 * The horizontal lockup geometry, and the logo SVGs in docs/brand (used by the README and docs),
 * which must match the logo grids.
 *
 * Notes:
 * The SVG files are file snapshots: after changing a grid or a color, run
 * `npx vitest run -u src/features/shared/brand/brandSvg.test.ts` to rewrite them.
 */

import { describe, expect, it } from "vitest";

import { site } from "@/content/site";
import {
  BANNER_LOCKUP,
  BRAND_DARK_STATIC_THEME_COLORS,
  BRAND_FIXED_COLORS,
  BRAND_STATIC_THEME_COLORS,
  HORIZONTAL_LOCKUP,
} from "@/features/shared/brand/brandArt";
import { lockup } from "@/features/shared/brand/brandPixels";
import { brandSvg } from "@/features/shared/brand/brandSvg";

const LIGHT = { ...BRAND_FIXED_COLORS, ...BRAND_STATIC_THEME_COLORS };
const DARK = { ...BRAND_FIXED_COLORS, ...BRAND_DARK_STATIC_THEME_COLORS };

describe("lockup", () => {
  it("places the wordmark 4 logo pixels after the 33-pixel pencil: 74 × 7 in total", () => {
    const horizontal = lockup(HORIZONTAL_LOCKUP);
    expect([horizontal.width, horizontal.height]).toEqual([74, 7]);
    expect(Math.min(...horizontal.runs.filter((run) => run.key === "i").map((run) => run.x))).toBe(37);
  });
});

describe("docs/brand logo files", () => {
  it.each([
    ["pixelhb-logo-light.svg", HORIZONTAL_LOCKUP, LIGHT, 6],
    ["pixelhb-logo-dark.svg", HORIZONTAL_LOCKUP, DARK, 6],
    ["pixelhb-banner-light.svg", BANNER_LOCKUP, LIGHT, 8],
    ["pixelhb-banner-dark.svg", BANNER_LOCKUP, DARK, 8],
  ] as const)("%s matches the logo grids", async (file, parts, colors, scale) => {
    await expect(brandSvg(lockup(parts), colors, scale, site.name)).toMatchFileSnapshot(
      `../../../../docs/brand/${file}`,
    );
  });
});
