/**
 * Purpose:
 * Classes for the IconButton primitive: a ghost square that grows to 44px on coarse pointers, and the
 * pressed state toggles use instead of the accent fill.
 */

import { focusRing } from "@/features/shared/components/focus.style";
import { cx } from "@/features/shared/utils/cx";

export const iconButton = {
  base: cx(
    "inline-flex h-10 min-w-10 shrink-0 touch-manipulation items-center justify-center rounded-lg px-2 pointer-coarse:h-11 pointer-coarse:min-w-11",
    "text-fg-soft transition-colors hover:bg-surface-muted",
    focusRing,
    "disabled:pointer-events-none disabled:opacity-50",
  ),
  /** Toggle on: a step up the surface ramp plus an inset ring, never the accent (The One Accent Rule). */
  pressed:
    "aria-pressed:bg-surface-strong aria-pressed:text-fg aria-pressed:ring-1 aria-pressed:ring-control-border aria-pressed:ring-inset aria-pressed:hover:bg-surface-strong",
};
