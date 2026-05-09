/**
 * Purpose:
 * Unit tests for palette index clamping helpers.
 */

import { describe, expect, it } from "vitest";

import { clampPaletteIndex } from "@/features/editor/logic/paletteMutations";

describe("clampPaletteIndex", () => {
  it("clamps to palette bounds", () => {
    expect(clampPaletteIndex(5, 3)).toBe(2);
    expect(clampPaletteIndex(-1, 4)).toBe(0);
  });

  it("returns 0 when palette is empty", () => {
    expect(clampPaletteIndex(3, 0)).toBe(0);
  });
});
