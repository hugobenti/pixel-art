/**
 * Purpose:
 * Unit tests for palette index clamping and the undoable palette-color removal.
 */

import { describe, expect, it } from "vitest";

import {
  clampPaletteIndex,
  removePaletteColor,
  revertPaletteRemoval,
} from "@/features/editor/logic/paletteMutations";

describe("clampPaletteIndex", () => {
  it("clamps to palette bounds", () => {
    expect(clampPaletteIndex(5, 3)).toBe(2);
    expect(clampPaletteIndex(-1, 4)).toBe(0);
  });

  it("returns 0 when palette is empty", () => {
    expect(clampPaletteIndex(3, 0)).toBe(0);
  });
});

const PALETTE = ["#000000", "#ff0000", "#00ff00", "#0000ff"];

function layers() {
  return [
    { id: "a", pixelData: Uint8Array.from([0, 1, 2, 3, 2]) },
    { id: "b", pixelData: Uint8Array.from([2, 2, 3, 0, 1]) },
  ];
}

describe("removePaletteColor", () => {
  it("drops the color, remaps every layer and records the pixels that used it", () => {
    const ls = layers();
    const result = removePaletteColor(ls, PALETTE, 2, { primaryIndex: 3, secondaryIndex: 2 });

    expect(result?.palette).toEqual(["#000000", "#ff0000", "#0000ff"]);
    expect(Array.from(ls[0].pixelData)).toEqual([0, 1, 0, 2, 0]);
    expect(Array.from(ls[1].pixelData)).toEqual([0, 0, 2, 0, 1]);
    expect(result?.removal.index).toBe(2);
    expect(result?.removal.color).toBe("#00ff00");
    expect(result?.removal.removedPixels.map((p) => [p.layerId, Array.from(p.indices)])).toEqual([
      ["a", [2, 4]],
      ["b", [0, 1]],
    ]);
    expect(result?.slots).toEqual({ primaryIndex: 2, secondaryIndex: 0 });
  });

  it("refuses to remove the last color or an index out of range", () => {
    expect(
      removePaletteColor(layers(), ["#000000"], 0, { primaryIndex: 0, secondaryIndex: 0 }),
    ).toBeNull();
    expect(
      removePaletteColor(layers(), PALETTE, 4, { primaryIndex: 0, secondaryIndex: 1 }),
    ).toBeNull();
  });
});

describe("revertPaletteRemoval", () => {
  it.each([0, 1, 2, 3])("restores every pixel after removing index %i", (index) => {
    const ls = layers();
    const before = ls.map((l) => Array.from(l.pixelData));
    const result = removePaletteColor(ls, PALETTE, index, { primaryIndex: 0, secondaryIndex: 1 });
    if (!result) {
      throw new Error("expected a removal");
    }

    revertPaletteRemoval(result.removal, ls);

    expect(ls.map((l) => Array.from(l.pixelData))).toEqual(before);
  });

  it("shifts pixels on every current layer, including colors and layers added later", () => {
    const ls = layers();
    const result = removePaletteColor(ls, PALETTE, 1, { primaryIndex: 0, secondaryIndex: 1 });
    if (!result) {
      throw new Error("expected a removal");
    }
    ls[0].pixelData[0] = 3;
    const added = { id: "c", pixelData: Uint8Array.from([0, 1, 2, 3]) };

    revertPaletteRemoval(result.removal, [...ls, added]);

    expect(ls[0].pixelData[0]).toBe(4);
    expect(Array.from(added.pixelData)).toEqual([0, 2, 3, 4]);
  });
});
