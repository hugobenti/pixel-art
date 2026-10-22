/**
 * Purpose:
 * Classes for the toast stack: top-centered live region, toast surface per tone, message and dismiss button.
 */

import { focusRing } from "@/features/shared/components/focus.style";
import { cx } from "@/features/shared/utils/cx";

export const toast = {
  region: cx(
    "pointer-events-none fixed inset-x-0 top-0 z-[100]",
    "flex flex-col items-center gap-2",
    "px-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-4",
  ),
  surface:
    "pointer-events-auto flex min-h-12 w-full max-w-lg items-start gap-3 rounded-lg border px-4 py-3 shadow-lg sm:min-w-[280px]",
  tone: {
    neutral: "border-line bg-surface text-fg",
    success: "border-success-line bg-success-surface text-success-fg",
    error: "border-danger-line bg-danger-surface text-danger-fg-strong",
  },
  text: "min-w-0 flex-1 text-sm leading-snug font-medium",
  dismiss: cx(
    "shrink-0 rounded-md px-1.5 py-0.5 text-lg leading-none text-current opacity-70 hover:opacity-100",
    focusRing,
  ),
};
