/**
 * Purpose:
 * Classes for the ColorSelectionRow: row frame, horizontal swatch scroller, swatch list and edit button.
 */

export const colorSelectionRow = {
  row: "flex w-full min-w-0 items-center gap-2 border-b border-line py-2",
  scroller: "flex min-w-0 flex-1 items-center gap-2 overflow-x-auto py-1 [scrollbar-width:thin]",
  swatchList: "flex items-center gap-1.5",
  /** Extends the outline Button. */
  editButton: "shrink-0 touch-manipulation px-3 py-2 text-sm whitespace-nowrap",
};
