import { focusRing } from "@/features/shared/components/focus.style";
import { cx } from "@/features/shared/utils/cx";

export const menu = {
  root: "relative inline-flex",
  items:
    "absolute top-full right-0 z-50 mt-1 min-w-44 rounded-lg border border-line bg-surface p-1 shadow-lg",
  item: cx(
    "flex min-h-10 w-full touch-manipulation items-center rounded-md px-3 py-2 text-left text-sm text-fg",
    "hover:bg-surface-subtle focus-visible:bg-surface-subtle pointer-coarse:min-h-11",
    focusRing,
    "disabled:pointer-events-none disabled:opacity-50",
  ),
};
