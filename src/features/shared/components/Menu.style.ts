import { focusRing } from "@/features/shared/components/focus.style";
import { cx } from "@/features/shared/utils/cx";

export const menu = {
  root: "relative inline-flex",
  items: "absolute right-0 z-50 min-w-44 rounded-lg border border-line bg-surface p-1 shadow-lg",
  placement: {
    below: "top-full mt-1",
    above: "bottom-full mb-1",
  },
  /** Until the dropdown is measured it is laid out but not painted, so it never jumps. */
  unmeasured: "invisible",
  item: cx(
    "flex min-h-10 w-full touch-manipulation items-center rounded-md px-3 py-2 text-left text-sm",
    "hover:bg-surface-subtle focus-visible:bg-surface-subtle pointer-coarse:min-h-11",
    focusRing,
    "disabled:pointer-events-none disabled:opacity-50",
  ),
  sheetList: "flex flex-col gap-1",
  sheetItem: cx(
    "min-h-12 w-full touch-manipulation rounded-lg px-3 text-left text-base",
    "hover:bg-surface-subtle",
    focusRing,
    "disabled:pointer-events-none disabled:opacity-50",
  ),
  tone: {
    default: "text-fg",
    danger: "text-danger-fg",
  },
};
