/**
 * Purpose:
 * Classes for the settings drawer image detail drill-in (palette usage list).
 */

export const editorSettingsImageDetailPanel = {
  root: "flex min-h-0 flex-1 flex-col gap-4 px-4 pb-4 pt-0 sm:px-4",
  hint: "text-xs font-normal leading-relaxed text-zinc-500",
  list: "max-h-[min(55vh,28rem)] min-h-0 divide-y divide-zinc-200 overflow-y-auto rounded-lg border border-zinc-200 bg-zinc-50",
  row: "flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-900",
  rowMeta: "flex min-w-0 flex-1 flex-col gap-0.5",
  rowTitle: "truncate font-medium tabular-nums",
  rowSub: "truncate text-xs font-normal text-zinc-500",
  swatch: "h-9 w-9 shrink-0 rounded border border-zinc-300 shadow-inner",
  swatchTransparent: "bg-zinc-200",
  count: "shrink-0 tabular-nums text-zinc-700",
  pct: "w-12 shrink-0 text-right text-xs tabular-nums text-zinc-500",
  empty:
    "rounded-lg border border-dashed border-zinc-300 bg-white px-3 py-6 text-center text-sm text-zinc-600",
};
