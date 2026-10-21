/**
 * Purpose:
 * View models for the palette edit modal: clamped selected swatch, swatch list, and the add-color draft.
 */
"use client";

import { useId, useState } from "react";

import { clampPaletteIndex } from "@/features/editor/logic/paletteMutations";

interface UsePaletteEditModalParams {
  palette: string[];
  focusedSwatchIndex: number;
}

export function usePaletteEditModal({ palette, focusedSwatchIndex }: UsePaletteEditModalParams) {
  const titleId = useId();
  const safeFocus = clampPaletteIndex(focusedSwatchIndex, palette.length);

  return {
    titleId,
    safeFocus,
    editHex: palette[safeFocus] ?? "#000000",
    swatches: palette.map((color, index) => ({
      key: `modal-swatch-${index}`,
      color,
      index,
      selected: index === safeFocus,
    })),
  };
}

export function usePaletteAddSection() {
  const [newHex, setNewHex] = useState("#808080");
  return { newHex, setNewHex };
}
