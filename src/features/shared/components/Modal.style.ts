/**
 * Purpose:
 * Classes for the shared Modal shell: overlay with placement, layer and blur; panel per size; backdrop.
 */

export const modal = {
  overlay: "fixed inset-0 bg-scrim/40 p-4",
  placement: {
    center: "flex items-center justify-center",
    bottomSheet: "flex items-end justify-center sm:items-center",
  },
  layer: {
    default: "z-50",
    elevated: "z-[60]",
  },
  blur: "backdrop-blur-sm",
  size: {
    sm: "relative w-full max-w-sm rounded-xl border border-line bg-surface p-4 shadow-lg",
    md: "relative flex w-full max-w-md flex-col gap-4 rounded-xl border border-line bg-surface p-6 shadow-xl",
    lg: "relative flex max-h-[85vh] w-full max-w-lg flex-col gap-4 overflow-y-auto rounded-xl border border-line bg-surface p-5 shadow-xl",
  },
  /** Full-overlay dismiss target behind the panel (pointer only; Escape covers keyboard). */
  backdrop: "absolute inset-0 cursor-default",
};
