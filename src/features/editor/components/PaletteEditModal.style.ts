/**
 * Purpose:
 * Classes for the PaletteEditModal: grouped sections with legends, the swatch grid (as many columns
 * as fit), and the color-field rows with their action.
 */

export const paletteEditModal = {
  section: "flex min-w-0 flex-col gap-2",
  legend: "mb-2 text-sm font-medium text-fg-secondary",
  /** Fixed 36px columns spread across the width, so the grid fits a 390px phone sheet. */
  swatchGrid: "grid grid-cols-[repeat(auto-fill,2.25rem)] justify-between gap-2",
  row: "flex flex-wrap items-start gap-2",
  fullNote: "text-xs text-subtle",
};
