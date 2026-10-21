/**
 * Purpose:
 * Classes for one reorderable row in the layers drawer list.
 */

export const sortableLayerItem = {
  item: "flex w-full min-w-0 cursor-pointer items-center gap-2 rounded-lg border px-2 py-2 text-left transition-colors sm:gap-3 sm:px-3",
  itemActive: "border-zinc-900 bg-zinc-100",
  itemIdle: "border-zinc-200 bg-white hover:bg-zinc-50",
  dragHandle:
    "flex h-10 w-10 shrink-0 cursor-grab touch-none items-center justify-center rounded-md border border-zinc-300 text-zinc-600 active:cursor-grabbing sm:h-9 sm:w-9",
  srOnly: "sr-only",
  previewWrap:
    "flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-zinc-300 bg-zinc-100 sm:h-14 sm:w-14",
  metadata: "min-w-0 flex-1",
  layerName: "truncate text-sm font-semibold text-zinc-900",
  layerActions: "ml-auto flex shrink-0 items-center gap-1 sm:gap-2",
  layerIconButton:
    "inline-flex h-10 w-10 shrink-0 touch-manipulation items-center justify-center rounded-md border border-zinc-300 text-zinc-700 transition-colors hover:bg-zinc-100 active:bg-zinc-100 sm:h-9 sm:w-9",
  layerIconImg: "h-5 w-5 object-contain pointer-events-none",
};
