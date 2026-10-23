/**
 * Purpose:
 * Classes for the ColorSelectionRow: row frame, horizontal swatch scroller, swatch list and the pinned edit button.
 */

export const colorSelectionRow = {
  row: "flex w-full min-w-0 items-center gap-2 border-b border-line py-2",
  scroller:
    "flex min-w-0 flex-1 items-center -ml-1 overflow-x-auto scroll-px-1 px-1 py-1 [scrollbar-width:thin]",
  /** Each selection ring reaches 4px past its swatch (2px ring + 2px offset); 10px keeps neighbours apart. */
  swatchList: "flex items-center gap-2.5",
  /** Flex item, not list-item: drops the line-box gap under each swatch so it lines up with the button. */
  swatchItem: "flex",
  /** Extends the outline Button. */
  editButton: "shrink-0 touch-manipulation px-3 py-2 text-sm whitespace-nowrap",
};
