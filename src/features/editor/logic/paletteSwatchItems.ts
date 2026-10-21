/**
 * Purpose:
 * Derive the per-swatch view items (key, color, primary/secondary/focus flags) for the palette row.
 */

import { clampPaletteIndex } from "@/features/editor/logic/paletteMutations";

export interface PaletteSwatchItem {
  key: string;
  color: string;
  index: number;
  isPrimary: boolean;
  isSecondary: boolean;
  isFocused: boolean;
}

export interface PaletteSwatchSelection {
  primaryIndex: number;
  secondaryIndex: number;
  focusedSwatchIndex: number;
}

/** Focus index is clamped into the palette so a stale focus still highlights a swatch. */
export function buildPaletteSwatchItems(
  palette: readonly string[],
  { primaryIndex, secondaryIndex, focusedSwatchIndex }: PaletteSwatchSelection
): PaletteSwatchItem[] {
  const safeFocus = clampPaletteIndex(focusedSwatchIndex, palette.length);
  return palette.map((color, index) => ({
    key: `swatch-${index}`,
    color,
    index,
    isPrimary: index === primaryIndex,
    isSecondary: index === secondaryIndex,
    isFocused: index === safeFocus,
  }));
}
