/**
 * Purpose:
 * Classes for the editor settings drawer shell and its menu rows.
 */

export const editorSettingsDrawer = {
  shellBody: "flex min-h-0 flex-1 flex-col overflow-hidden",
  menuRoot: "min-h-0 flex-1 overflow-y-auto px-0 pb-3 pt-0 sm:pb-4",
  menuList: "flex flex-col divide-y divide-zinc-200 bg-white",
  menuRow:
    "flex min-h-12 w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-zinc-900 transition-colors active:bg-zinc-100 touch-manipulation",
  menuRowMuted: "cursor-not-allowed opacity-50 active:bg-transparent",
  menuHint: "shrink-0 text-xs font-normal text-zinc-500",
  rowLead: "flex min-w-0 flex-1 items-center gap-3",
  menuIcon: "h-6 w-6 text-zinc-600",
};
