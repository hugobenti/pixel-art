/**
 * Purpose:
 * Classes for the GalleryGrid: responsive card grid and the empty-state panel.
 */

export const galleryGrid = {
  grid: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  empty:
    "flex flex-col items-center gap-3 rounded-xl border border-dashed border-line-strong p-12 text-center",
  emptyIcon: "size-8 text-muted",
  emptyTitle: "text-base font-semibold text-fg",
  emptyText: "max-w-prose text-sm text-muted",
  emptyActions: "mt-2 flex flex-wrap justify-center gap-2",
};
