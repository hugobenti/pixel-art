/**
 * Purpose:
 * Classes for the palette edit modal and its add-color section.
 */

export const paletteEditModal = {
  header: "flex items-start justify-between gap-3",
  title: "text-lg font-semibold text-zinc-900",
  legend: "text-xs font-medium text-zinc-600",
  swatchGrid: "grid grid-cols-8 gap-2 sm:grid-cols-10 mt-2",
  selectedRow: "flex flex-wrap items-center gap-3 border-t border-zinc-200 pt-4",
  colorLabel: "flex items-center gap-2 text-sm text-zinc-700",
  editColorInput: "h-10 w-12 cursor-pointer rounded border border-zinc-300 bg-white p-1",
  addSection: "flex flex-col gap-2 border-t border-zinc-200 pt-4",
  addRow: "flex flex-wrap items-center gap-2",
  addColorInput:
    "h-10 w-12 cursor-pointer rounded border border-zinc-300 bg-white p-1 disabled:opacity-50",
  fullHint: "text-xs text-zinc-500",
};
