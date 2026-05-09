/**
 * Purpose:
 * Layout class strings and public asset paths for the layers drawer UI.
 */

import { PUBLIC_ICONS } from "@/features/shared/constants/publicIcons";

export const ANIMATION_MS = 180;

/** Long edge cap when rasterizing a layer into the list thumbnail (pixel-perfect downscale). */
export const LAYER_PREVIEW_MAX_EDGE_PX = 48;

/** Grip / pencil / copy assets for layer rows (still loaded via `next/image`). */
export const LAYER_ICON_SRC = {
  grip: PUBLIC_ICONS.grip,
  pencil: PUBLIC_ICONS.pencil,
  copy: PUBLIC_ICONS.copy,
} as const;

export const layerIconImgClass = "h-5 w-5 object-contain pointer-events-none";

export const listWrapClass =
  "min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3 touch-pan-y sm:px-4";
export const listClass = "flex flex-col gap-2";
export const itemClass =
  "flex w-full min-w-0 cursor-pointer items-center gap-2 rounded-lg border px-2 py-2 text-left transition-colors sm:gap-3 sm:px-3";
export const itemActiveClass = "border-zinc-900 bg-zinc-100";
export const itemIdleClass = "border-zinc-200 bg-white hover:bg-zinc-50";
export const dragHandleClass =
  "flex h-10 w-10 shrink-0 cursor-grab touch-none items-center justify-center rounded-md border border-zinc-300 text-zinc-600 active:cursor-grabbing sm:h-9 sm:w-9";
export const previewWrapClass =
  "flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-zinc-300 bg-zinc-100 sm:h-14 sm:w-14";
export const previewImageClass =
  "max-h-full max-w-full object-contain rounded-sm shadow-sm";
export const previewPlaceholderClass =
  "h-full min-h-[2.25rem] w-full min-w-[2.25rem] rounded-sm border border-dashed border-zinc-300 bg-zinc-50 sm:min-h-[2.75rem] sm:min-w-[2.75rem]";
export const metadataClass = "min-w-0 flex-1";
export const layerNameClass = "truncate text-sm font-semibold text-zinc-900";
export const footerClass =
  "hidden shrink-0 border-t border-zinc-200 px-3 py-3 text-xs text-zinc-600 sm:block sm:px-4";
export const actionsRowClass =
  "flex shrink-0 flex-wrap items-center gap-2 border-b border-zinc-200 px-3 py-3 sm:px-4";
export const layerIconButtonClass =
  "inline-flex h-10 w-10 shrink-0 touch-manipulation items-center justify-center rounded-md border border-zinc-300 text-zinc-700 transition-colors hover:bg-zinc-100 active:bg-zinc-100 sm:h-9 sm:w-9";
export const layerActionsClass =
  "ml-auto flex shrink-0 items-center gap-1 sm:gap-2";
