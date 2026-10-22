/**
 * Purpose:
 * Classes for the ShiftDirectionOverlay: dimming backdrop, bottom controls frame, round arrow pad and its buttons.
 */

export const shiftDirectionOverlay = {
  /** Full-screen dismiss target behind the pad (pointer only; Escape covers keyboard). */
  backdrop: "fixed inset-0 z-40 bg-scrim/30",
  controls: "pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pt-4 pb-6",
  pad: "pointer-events-auto flex h-40 w-40 flex-col items-center rounded-full border border-line bg-surface-inverse/90 p-2 shadow-lg",
  sideRow: "flex w-36 items-center justify-between gap-2",
  /** Extends the outline Button: a 48px arrow key on a surface tile, readable on the inverse pad. */
  arrow: "h-12 min-w-12 px-2",
  arrowIcon: "h-6 w-6",
};
