/**
 * Purpose:
 * Unit tests for canvas resize buffers (top-left anchor, fill index).
 */
import { describe, expect, it } from "vitest";

import {
  fillPaletteIndexForExpansion,
  resizeArtworkDimensions,
  resizeLayerPixelData,
} from "@/features/editor/logic/resizeCanvas";

import type { Artwork } from "@/features/editor/types/editor.types";

describe("resizeLayerPixelData", () => {
  it("copies top-left region when expanding", () => {
    const src = new Uint8Array(4);
    src.fill(9);
    src[0] = 1;
    src[1] = 2;
    src[2] = 3;
    src[3] = 4;
    const out = resizeLayerPixelData(2, 2, 3, 2, src, 0);
    expect(out.length).toBe(6);
    expect(out[0]).toBe(1);
    expect(out[1]).toBe(2);
    expect(out[2]).toBe(0);
    expect(out[3]).toBe(3);
    expect(out[4]).toBe(4);
    expect(out[5]).toBe(0);
  });

  it("crops when shrinking", () => {
    const src = new Uint8Array([1, 2, 3, 4]);
    const out = resizeLayerPixelData(2, 2, 1, 2, src, 0);
    expect(Array.from(out)).toEqual([1, 3]);
  });
});

describe("fillPaletteIndexForExpansion", () => {
  it("prefers normalized white when present", () => {
    expect(fillPaletteIndexForExpansion(["#000000", "#FFFFFF"])).toBe(1);
    expect(fillPaletteIndexForExpansion(["#fff"])).toBe(0);
  });

  it("falls back to zero without white", () => {
    expect(fillPaletteIndexForExpansion(["#FF0000", "#00FF00"])).toBe(0);
  });
});

describe("resizeArtworkDimensions", () => {
  it("returns same reference when dimensions unchanged", () => {
    const artwork: Artwork = {
      id: "a",
      title: "t",
      width: 2,
      height: 2,
      createdAt: 0,
      updatedAt: 0,
      thumbnail: "",
      palette: ["#000000", "#FFFFFF"],
      activeLayerId: "l1",
      layers: [
        {
          id: "l1",
          name: "L",
          visible: true,
          pixelData: new Uint8Array([1, 1, 1, 1]),
        },
      ],
    };
    expect(resizeArtworkDimensions(artwork, 2, 2)).toBe(artwork);
  });
});
