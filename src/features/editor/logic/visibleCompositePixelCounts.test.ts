/**
 * Purpose:
 * Tests for viewport-aware composite pixel counting (layer order and transparency).
 */

import { describe, expect, it } from "vitest";

import {
  compositeOpaquePaletteIndexAt,
  countVisibleCompositePixelsByPaletteIndex,
  isArtworkPixelVisibleInViewport,
} from "@/features/editor/logic/visibleCompositePixelCounts";
import type { Artwork, ViewportState } from "@/features/editor/types/editor.types";

function layer(id: string, pixels: number[]): Artwork["layers"][0] {
  return {
    id,
    name: id,
    visible: true,
    pixelData: new Uint8Array(pixels),
  };
}

describe("isArtworkPixelVisibleInViewport", () => {
  it("returns true when the scaled pixel rect intersects the CSS viewport", () => {
    const viewport: ViewportState = {
      scale: 10,
      viewOffset: { x: 0, y: 0 },
    };
    expect(isArtworkPixelVisibleInViewport(0, 0, viewport, 100, 100)).toBe(true);
    expect(isArtworkPixelVisibleInViewport(9, 0, viewport, 100, 100)).toBe(true);
    expect(isArtworkPixelVisibleInViewport(10, 0, viewport, 100, 100)).toBe(false);
  });

  it("respects pan offset", () => {
    const viewport: ViewportState = {
      scale: 10,
      viewOffset: { x: -55, y: 0 },
    };
    expect(isArtworkPixelVisibleInViewport(5, 0, viewport, 100, 100)).toBe(true);
    expect(isArtworkPixelVisibleInViewport(4, 0, viewport, 100, 100)).toBe(false);
  });
});

describe("compositeOpaquePaletteIndexAt", () => {
  it("uses the topmost visible non-transparent layer (lower array index draws on top)", () => {
    const artwork: Pick<Artwork, "width" | "height" | "layers" | "palette"> = {
      width: 2,
      height: 1,
      palette: ["transparent", "#f00", "#00f"],
      layers: [
        layer("top", [2, 0]),
        layer("bottom", [1, 1]),
      ],
    };
    expect(compositeOpaquePaletteIndexAt(artwork, 0, 0)).toBe(2);
    expect(compositeOpaquePaletteIndexAt(artwork, 1, 0)).toBe(1);
  });

  it("skips invisible layers", () => {
    const artwork: Pick<Artwork, "width" | "height" | "layers" | "palette"> = {
      width: 1,
      height: 1,
      palette: ["transparent", "#f00"],
      layers: [
        { ...layer("top", [0]), visible: false },
        layer("bottom", [1]),
      ],
    };
    expect(compositeOpaquePaletteIndexAt(artwork, 0, 0)).toBe(1);
  });
});

describe("countVisibleCompositePixelsByPaletteIndex", () => {
  it("counts only viewport-intersecting pixels once", () => {
    const artwork: Pick<Artwork, "width" | "height" | "layers" | "palette"> = {
      width: 3,
      height: 1,
      palette: ["transparent", "#aaa", "#bbb"],
      layers: [layer("a", [1, 1, 2])],
    };
    const viewport: ViewportState = { scale: 1, viewOffset: { x: 1, y: 0 } };
    const result = countVisibleCompositePixelsByPaletteIndex(artwork, viewport, 3, 10);
    expect(result.totalViewportCells).toBe(2);
    expect(result.totalCompositeOpaque).toBe(2);
    expect(result.countsByPaletteIndex.get(1)).toBe(2);
  });
});
