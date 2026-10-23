/**
 * Purpose:
 * Classes for SiteShell: page frame, skip link and the main column.
 */

import { focusRing } from "@/features/shared/components/focus.style";
import { cx } from "@/features/shared/utils/cx";

export const siteShell = {
  frame: "flex min-h-dvh flex-col bg-bg",
  skipLink: cx(
    "sr-only rounded-lg bg-surface px-4 py-2 text-sm font-medium text-fg focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50",
    focusRing,
  ),
  main: "mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:py-12",
};
