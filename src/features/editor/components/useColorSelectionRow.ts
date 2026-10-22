/**
 * Purpose:
 * ColorSelectionRow view model: which swatch carries the roving focus outline, kept inside the palette.
 */
"use client";

import { clampPaletteIndex } from "@/features/editor/logic/paletteMutations";
import type { IColorSelectionRowProps } from "./ColorSelectionRow.type";

export function useColorSelectionRow({ palette, focusedSwatchIndex }: IColorSelectionRowProps) {
  return { focusedIndex: clampPaletteIndex(focusedSwatchIndex, palette.length) };
}
