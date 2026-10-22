/**
 * Purpose:
 * Classes for the PaletteReplacementPicker: legend, swatch grid (same 36px columns as the palette
 * modal) and the transparent chip, which wears the canvas checkerboard and the swatch rings.
 */

import { colorSwatch } from "@/features/shared/components/ColorSwatch.style";
import { cx } from "@/features/shared/utils/cx";

export const paletteReplacementPicker = {
  section: "flex min-w-0 flex-col gap-2",
  legend: "mb-2 text-sm font-medium text-fg-secondary",
  grid: "grid grid-cols-[repeat(auto-fill,2.25rem)] gap-2.5",
  transparent: {
    base: cx(colorSwatch.density.compact, "pixel-checkerboard"),
    selected: colorSwatch.ring.selected,
    idle: colorSwatch.ring.idle,
  },
};
