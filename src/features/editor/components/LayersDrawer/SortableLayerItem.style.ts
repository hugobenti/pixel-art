/**
 * Purpose:
 * Classes for a SortableLayerItem row: drag handle, select button with preview and name, icon actions.
 */

import { focusRing } from "@/features/shared/components/focus.style";
import { cx } from "@/features/shared/utils/cx";

export const sortableLayerItem = {
  wrap: "motion-reduce:transition-none!",
  row: "flex w-full min-w-0 items-center gap-2 rounded-lg border px-2 py-2 text-left transition-colors sm:gap-3 sm:px-3",
  rowState: {
    active: "border-accent bg-surface-muted",
    idle: "border-line bg-surface hover:bg-surface-subtle",
  },
  dragHandle: cx(
    "flex h-10 w-10 shrink-0 cursor-grab touch-none items-center justify-center rounded-md border border-line-strong text-muted active:cursor-grabbing sm:h-9 sm:w-9",
    focusRing,
  ),
  srOnly: "sr-only",
  selectButton: cx(
    "flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-md text-left sm:gap-3",
    focusRing,
  ),
  previewWrap:
    "flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-line-strong bg-surface-muted sm:h-14 sm:w-14",
  metadata: "min-w-0 flex-1",
  layerName: "truncate text-sm font-semibold text-fg",
  actions: "ml-auto flex shrink-0 items-center gap-1 sm:gap-2",
  iconButton: cx(
    "inline-flex h-10 w-10 shrink-0 touch-manipulation items-center justify-center rounded-md border border-line-strong text-fg-secondary transition-colors hover:bg-surface-muted active:bg-surface-muted sm:h-9 sm:w-9",
    focusRing,
  ),
  icon: "pointer-events-none h-5 w-5 object-contain",
};
