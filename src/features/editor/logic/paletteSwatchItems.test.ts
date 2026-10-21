/**
 * Purpose:
 * Unit tests for the palette swatch view items rendered by the color selection row.
 */

import { describe, expect, it } from "vitest";

import { buildPaletteSwatchItems } from "@/features/editor/logic/paletteSwatchItems";

describe("buildPaletteSwatchItems", () => {
  it("flags primary, secondary and focused swatches with stable keys", () => {
    const items = buildPaletteSwatchItems(["#000000", "#ffffff", "#ff0000"], {
      primaryIndex: 0,
      secondaryIndex: 2,
      focusedSwatchIndex: 1,
    });
    expect(items).toEqual([
      {
        key: "swatch-0",
        color: "#000000",
        index: 0,
        isPrimary: true,
        isSecondary: false,
        isFocused: false,
      },
      {
        key: "swatch-1",
        color: "#ffffff",
        index: 1,
        isPrimary: false,
        isSecondary: false,
        isFocused: true,
      },
      {
        key: "swatch-2",
        color: "#ff0000",
        index: 2,
        isPrimary: false,
        isSecondary: true,
        isFocused: false,
      },
    ]);
  });

  it("clamps an out-of-range focus index to the last swatch", () => {
    const items = buildPaletteSwatchItems(["#000000", "#ffffff"], {
      primaryIndex: 0,
      secondaryIndex: 1,
      focusedSwatchIndex: 9,
    });
    expect(items.map((item) => item.isFocused)).toEqual([false, true]);
  });

  it("clamps a negative focus index to the first swatch", () => {
    const items = buildPaletteSwatchItems(["#000000", "#ffffff"], {
      primaryIndex: 0,
      secondaryIndex: 1,
      focusedSwatchIndex: -3,
    });
    expect(items.map((item) => item.isFocused)).toEqual([true, false]);
  });

  it("returns no items for an empty palette", () => {
    expect(
      buildPaletteSwatchItems([], {
        primaryIndex: 0,
        secondaryIndex: 0,
        focusedSwatchIndex: 0,
      }),
    ).toEqual([]);
  });
});
