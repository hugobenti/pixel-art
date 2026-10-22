/**
 * Purpose:
 * Classes for the CreateArtworkModal dialog body: size group (presets and fields), hint and form error.
 */

import { focusRing } from "@/features/shared/components/focus.style";
import { cx } from "@/features/shared/utils/cx";

export const createArtworkModal = {
  sizeGroup: "flex min-w-0 flex-col gap-3",
  legend: "mb-1 text-sm text-fg-secondary",
  presets: "w-full",
  preset: cx(
    "min-h-9 flex-1 rounded-md px-3 font-mono text-sm text-fg-soft tabular-nums transition-colors hover:bg-surface-muted",
    "aria-pressed:bg-surface-strong aria-pressed:text-fg aria-pressed:ring-1 aria-pressed:ring-line-strong aria-pressed:ring-inset",
    focusRing,
  ),
  sizeFields: "grid grid-cols-2 items-start gap-3",
  hint: "text-xs text-subtle",
  formError: "text-sm text-danger-fg",
};
