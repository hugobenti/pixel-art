/**
 * Purpose:
 * Unit tests for the PixelHB logo grids, their run encoding and the icon / social image layouts.
 */

import { describe, expect, it } from "vitest";

import {
  BRAND_FIXED_COLORS,
  BRAND_GRIDS,
  BRAND_STATIC_THEME_COLORS,
  PENCIL_END_GRID,
} from "@/features/shared/brand/brandArt";
import { TRANSPARENT_BACKGROUND, iconImage, ogImage } from "@/features/shared/brand/brandImageLayout";
import { gridRuns } from "@/features/shared/brand/brandPixels";

const TOKENS = { surface: "#fcfbf7", bg: "#ece9e1", line: "#dcd8cd", fgSecondary: "#3a3c46" };

describe("brand grids", () => {
  it.each(Object.entries(BRAND_GRIDS))("%s is rectangular and every pixel has a color", (_name, grid) => {
    const colors = { ...BRAND_FIXED_COLORS, ...BRAND_STATIC_THEME_COLORS };
    expect(new Set(grid.map((row) => row.length)).size).toBe(1);
    const unknown = grid.join("").replaceAll(".", "").split("").filter((key) => !(key in colors));
    expect(unknown).toEqual([]);
  });

  it("the pencil and the wordmark are the same height, so the lockup lines up", () => {
    expect(BRAND_GRIDS.pencil).toHaveLength(7);
    expect(BRAND_GRIDS.wordmark).toHaveLength(7);
    expect(BRAND_GRIDS.brandPencil).toHaveLength(7);
  });
});

describe("gridRuns", () => {
  it("merges same-color neighbours in a row and splits on color changes and gaps", () => {
    expect(gridRuns(["yyY.y", ".oo.."])).toEqual([
      { x: 0, y: 0, length: 2, key: "y" },
      { x: 2, y: 0, length: 1, key: "Y" },
      { x: 4, y: 0, length: 1, key: "y" },
      { x: 1, y: 1, length: 2, key: "o" },
    ]);
  });
});

function opaqueBounds(blocks: { left: number; top: number; width: number; height: number }[]) {
  return {
    left: Math.min(...blocks.map((b) => b.left)),
    top: Math.min(...blocks.map((b) => b.top)),
    right: Math.max(...blocks.map((b) => b.left + b.width)),
    bottom: Math.max(...blocks.map((b) => b.top + b.height)),
  };
}

describe("iconImage", () => {
  it.each([16, 32, 48])("draws the pencil end edge to edge on a transparent %ipx favicon", (size) => {
    const image = iconImage(size, TOKENS.surface);
    expect(image.blocks.every((b) => b.height === size / 16)).toBe(true);
    expect(gridRuns(PENCIL_END_GRID)).toHaveLength(image.blocks.length);
    expect(image.background).toBe(TRANSPARENT_BACKGROUND);
  });

  it.each([
    [180, 7],
    [192, 8],
    [512, 22],
  ])("centers the pencil end at a whole-number scale on the %ipx tile", (size, scale) => {
    const image = iconImage(size, TOKENS.surface);
    expect(image.background).toBe(TOKENS.surface);
    expect(image.blocks.every((b) => b.height === scale && Number.isInteger(b.left) && Number.isInteger(b.top))).toBe(true);
    const bounds = opaqueBounds(image.blocks);
    expect(bounds.left).toBe(size - bounds.right);
    expect(bounds.top).toBe(size - bounds.bottom);
  });

  it("keeps every pixel of the 512 tile inside the maskable safe zone (central 80% circle)", () => {
    const image = iconImage(512, TOKENS.surface);
    const radius = 512 * 0.4;
    for (const b of image.blocks) {
      for (const [x, y] of [
        [b.left, b.top],
        [b.left + b.width, b.top],
        [b.left, b.top + b.height],
        [b.left + b.width, b.top + b.height],
      ]) {
        expect(Math.hypot(x - 256, y - 256)).toBeLessThanOrEqual(radius);
      }
    }
  });
});

describe("ogImage", () => {
  it("puts the brand pencil on the 20px paper grid, centered, with the caption below it", () => {
    const image = ogImage({ paper: TOKENS.bg, gridLine: TOKENS.line, captionColor: TOKENS.fgSecondary, caption: "Pixel-art editor", fontFamily: "Schibsted Grotesk" });
    expect([image.width, image.height]).toEqual([1200, 630]);
    const pencil = image.blocks.filter((b) => b.color !== TOKENS.line);
    const bounds = opaqueBounds(pencil);
    expect(bounds.left).toBe(1200 - bounds.right);
    expect(pencil.every((b) => b.left % 20 === 0 && b.top % 20 === 0 && b.height === 20)).toBe(true);
    expect(image.caption?.top).toBeGreaterThan(bounds.bottom);
  });
});
