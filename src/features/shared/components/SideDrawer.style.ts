/**
 * Purpose:
 * Classes for the shared right-edge SideDrawer shell (backdrop + sliding panel + header).
 */

import { cx } from "@/features/shared/utils/cx";

export const sideDrawer = {
  root: "pointer-events-auto fixed inset-0 z-50 flex items-stretch justify-end",
  backdrop: "absolute inset-0 bg-scrim/45 transition-opacity",
  backdropState: {
    open: "opacity-100",
    closed: "opacity-0",
  },
  panel: cx(
    "relative z-10 flex h-full max-h-[100dvh] w-[90%] flex-col overflow-hidden pb-[env(safe-area-inset-bottom)] sm:w-1/2 sm:max-w-[720px]",
    "border-l border-line-strong bg-surface shadow-2xl",
    "transition-transform ease-out motion-reduce:transition-opacity",
  ),
  panelState: {
    open: "translate-x-0",
    closed: "translate-x-full motion-reduce:translate-x-0 motion-reduce:opacity-0",
  },
  header: "flex shrink-0 items-center justify-between gap-2 border-b border-line px-3 py-3 sm:px-4",
  titleRow: "flex min-w-0 flex-1 items-center gap-2",
  heading: "min-w-0 truncate text-base font-semibold text-fg",
};
