/**
 * Purpose:
 * Unit tests for layer thumbnail sizing used by the layers drawer preview.
 */

import { describe, expect, it } from "vitest";

import { layerThumbnailSize } from "@/features/editor/logic/layerPreviewRaster";

describe("layerThumbnailSize", () => {
  it("fits a square artwork to the max edge", () => {
    expect(layerThumbnailSize(16, 16, 48)).toEqual({ width: 48, height: 48 });
    expect(layerThumbnailSize(96, 96, 48)).toEqual({ width: 48, height: 48 });
  });

  it("keeps the aspect ratio with the long edge at the cap", () => {
    expect(layerThumbnailSize(64, 32, 48)).toEqual({ width: 48, height: 24 });
    expect(layerThumbnailSize(10, 30, 48)).toEqual({ width: 16, height: 48 });
  });

  it("never returns an edge smaller than 1px", () => {
    expect(layerThumbnailSize(1000, 1, 48)).toEqual({ width: 48, height: 1 });
  });
});
