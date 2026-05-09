/**
 * Purpose:
 * Unit tests for stroke delta merging (one undo cell per index).
 */

import { describe, expect, it } from "vitest";

import { mergeStrokeDeltas } from "@/features/editor/logic/mergeStrokeDeltas";

describe("mergeStrokeDeltas", () => {
  it("keeps first previousPaletteIndex and last newPaletteIndex per cell", () => {
    const out = mergeStrokeDeltas([
      {
        layerId: "a",
        index: 0,
        previousPaletteIndex: 1,
        newPaletteIndex: 2,
      },
      {
        layerId: "a",
        index: 0,
        previousPaletteIndex: 9,
        newPaletteIndex: 3,
      },
    ]);
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({
      layerId: "a",
      index: 0,
      previousPaletteIndex: 1,
      newPaletteIndex: 3,
    });
  });

  it("preserves distinct indices", () => {
    const out = mergeStrokeDeltas([
      {
        layerId: "a",
        index: 0,
        previousPaletteIndex: 0,
        newPaletteIndex: 1,
      },
      {
        layerId: "a",
        index: 1,
        previousPaletteIndex: 2,
        newPaletteIndex: 4,
      },
    ]);
    expect(out).toHaveLength(2);
  });
});
