/**
 * Purpose:
 * Classes for the toast stack: live regions pinned to the bottom on phones and the top from `sm`,
 * toast surface per tone, message, action button and the 32px icon dismiss button.
 */

import { focusRing } from "@/features/shared/components/focus.style";
import { cx } from "@/features/shared/utils/cx";

export const toast = {
  region: cx(
    "pointer-events-none fixed inset-x-0 bottom-0 z-[100]",
    "flex flex-col items-center gap-2",
    "px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]",
    "sm:top-0 sm:bottom-auto sm:px-4 sm:pt-[max(0.75rem,env(safe-area-inset-top))] sm:pb-0",
  ),
  /** Error toasts (each `role="alert"`); hidden while empty so it adds no gap. */
  alertList: "flex w-full flex-col items-center gap-2 empty:hidden",
  /** Polite live region for the other tones; stays mounted so additions are announced. */
  statusList: "flex w-full flex-col items-center gap-2",
  surface:
    "pointer-events-auto flex min-h-12 w-full max-w-lg items-center gap-2 rounded-lg border py-2 pr-2 pl-4 shadow-lg sm:min-w-[280px]",
  tone: {
    neutral: "border-line bg-surface text-fg",
    success: "border-success-line bg-success-surface text-success-fg",
    error: "border-danger-line bg-danger-surface text-danger-fg-strong",
  },
  text: "min-w-0 flex-1 py-1 text-sm leading-snug font-medium",
  action: cx(
    "inline-flex h-8 shrink-0 items-center rounded-md px-2 text-sm font-semibold text-current underline-offset-2 hover:underline",
    focusRing,
  ),
  dismiss: cx(
    "inline-flex size-8 shrink-0 items-center justify-center rounded-md text-current opacity-70 hover:opacity-100",
    focusRing,
  ),
  dismissIcon: "h-4 w-4",
};
