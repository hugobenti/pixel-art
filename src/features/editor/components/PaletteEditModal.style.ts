/**
 * Purpose:
 * Classes for the PaletteEditModal: swatch grid, selected-color row, add-color section and native color inputs.
 */

import { focusRing } from "@/features/shared/components/focus.style";
import { cx } from "@/features/shared/utils/cx";

const colorInput = cx(
  "h-10 w-12 cursor-pointer rounded border border-control-border bg-surface p-1",
  focusRing,
);

export const paletteEditModal = {
  legend: "text-xs font-medium text-muted",
  swatchGrid: "mt-2 grid grid-cols-8 gap-2 sm:grid-cols-10",
  selectedRow: "flex flex-wrap items-center gap-3 border-t border-line pt-4",
  colorLabel: "flex items-center gap-2 text-sm text-fg-secondary",
  colorInput,
  /** The add-color input is disabled once the palette is full. */
  newColorInput: cx(colorInput, "disabled:opacity-50"),
  addSection: "flex flex-col gap-2 border-t border-line pt-4",
  addRow: "flex flex-wrap items-center gap-2",
  fullNote: "text-xs text-subtle",
};
