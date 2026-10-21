/**
 * Purpose:
 * Classes for the shared Modal shell (placement, size, z-index, backdrop).
 */

export const modal = {
  overlay: "fixed inset-0 bg-black/40 p-4",
  layer: {
    default: "z-50",
    elevated: "z-[60]",
  },
  placement: {
    center: "flex items-center justify-center",
    bottomSheet: "flex items-end justify-center sm:items-center",
  },
  backdropBlur: "backdrop-blur-sm",
  size: {
    sm: "w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-4 shadow-lg",
    md: "flex w-full max-w-md flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-xl",
    lg: "flex max-h-[85vh] w-full max-w-lg flex-col gap-4 overflow-y-auto rounded-xl border border-zinc-200 bg-white p-5 shadow-xl",
  },
};
