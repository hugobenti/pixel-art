/**
 * Purpose:
 * Unit tests for the layer list thumbnail: pixel painting and nearest-neighbor thumbnail size.
 */

import { describe, expect, it } from "vitest";

import { layerPreviewThumbSize, paintLayerPixels } from "./layerPreviewRaster";

function recordingTarget() {
  const fills: Array<{ x: number; y: number; w: number; h: number; color: string }> = [];
  const target = {
    fillStyle: "" as string | CanvasGradient | CanvasPattern,
    fillRect(x: number, y: number, w: number, h: number) {
      fills.push({ x, y, w, h, color: String(target.fillStyle) });
    },
  };
  return { target, fills };
}

describe("paintLayerPixels", () => {
  it("fills one 1×1 rect per opaque pixel, row by row, in its palette color", () => {
    const { target, fills } = recordingTarget();
    paintLayerPixels(target, new Uint8Array([0, 1, 1, 0]), ["#000000", "#FF0000"], 2, 2);
    expect(fills).toEqual([
      { x: 0, y: 0, w: 1, h: 1, color: "#000000" },
      { x: 1, y: 0, w: 1, h: 1, color: "#FF0000" },
      { x: 0, y: 1, w: 1, h: 1, color: "#FF0000" },
      { x: 1, y: 1, w: 1, h: 1, color: "#000000" },
    ]);
  });

  it("skips transparent entries and indices outside the palette", () => {
    const { target, fills } = recordingTarget();
    paintLayerPixels(target, new Uint8Array([0, 1, 7]), ["transparent", "#00FF00"], 3, 1);
    expect(fills).toEqual([{ x: 1, y: 0, w: 1, h: 1, color: "#00FF00" }]);
  });
});

describe("layerPreviewThumbSize", () => {
  it("scales the long edge to the cap and keeps the aspect ratio", () => {
    expect(layerPreviewThumbSize(100, 50, 48)).toEqual({ width: 48, height: 24 });
    expect(layerPreviewThumbSize(30, 90, 48)).toEqual({ width: 16, height: 48 });
  });

  it("scales small artworks up to the cap", () => {
    expect(layerPreviewThumbSize(16, 16, 48)).toEqual({ width: 48, height: 48 });
  });

  it("rounds and never goes below one pixel", () => {
    expect(layerPreviewThumbSize(1000, 1, 48)).toEqual({ width: 48, height: 1 });
    expect(layerPreviewThumbSize(7, 3, 48)).toEqual({ width: 48, height: 21 });
  });
});
