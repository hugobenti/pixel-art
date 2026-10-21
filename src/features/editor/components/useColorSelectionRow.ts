/**
 * Purpose:
 * View model for ColorSelectionRow: ready-to-render swatch items for the current palette selection.
 */

import { useMemo } from "react";

import { buildPaletteSwatchItems } from "@/features/editor/logic/paletteSwatchItems";

interface UseColorSelectionRowOptions {
  palette: string[];
  primaryIndex: number;
  secondaryIndex: number;
  focusedSwatchIndex: number;
}

export function useColorSelectionRow({
  palette,
  primaryIndex,
  secondaryIndex,
  focusedSwatchIndex,
}: UseColorSelectionRowOptions) {
  const swatches = useMemo(
    () =>
      buildPaletteSwatchItems(palette, {
        primaryIndex,
        secondaryIndex,
        focusedSwatchIndex,
      }),
    [palette, primaryIndex, secondaryIndex, focusedSwatchIndex]
  );

  return { swatches };
}
