/**
 * Purpose:
 * Classes for the Switch row: full-width row (44px on coarse pointers), label and hint, and the
 * track/thumb that follow `aria-checked` and dim alone when disabled.
 */

import { cx } from "@/features/shared/utils/cx";

export const switchRow = {
  base: cx(
    "group flex min-h-10 w-full touch-manipulation items-center justify-between gap-3 text-left text-sm font-medium text-fg transition-colors pointer-coarse:min-h-11",
    "hover:bg-surface-subtle active:bg-surface-muted",
    "disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:active:bg-transparent",
    "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus",
  ),
  lead: "flex min-w-0 flex-1 items-center gap-3",
  text: "flex min-w-0 flex-col gap-0.5",
  hint: "text-xs font-normal text-subtle",
  track: cx(
    "flex h-6 w-10 shrink-0 items-center rounded-md border border-control-border bg-surface-strong p-0.5 transition-colors",
    "group-disabled:opacity-50 group-aria-checked:border-fg group-aria-checked:bg-fg",
    "motion-reduce:transition-none",
  ),
  thumb: cx(
    "block size-4.5 rounded-sm bg-surface shadow-sm transition-transform duration-150",
    "group-aria-checked:translate-x-4 motion-reduce:transition-none",
  ),
};
