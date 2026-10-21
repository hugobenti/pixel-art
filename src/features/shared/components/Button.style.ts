/**
 * Purpose:
 * Classes for the shared Button primitive: base, sizes, variants and the ghost step adjustment.
 */
import { cx } from "@/features/shared/utils/cx";

export const button = {
  base: cx(
    "inline-flex items-center justify-center font-medium transition-colors",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50",
  ),
  size: {
    default: "min-h-10 px-3 py-2 text-sm rounded-lg",
    icon: "h-10 min-w-10 shrink-0 rounded-lg px-2 text-base font-semibold",
    step: "h-9 min-w-9 rounded-md text-lg font-semibold leading-none disabled:cursor-not-allowed",
  },
  variant: {
    primary: "bg-zinc-900 text-zinc-50 hover:bg-zinc-800 focus-visible:outline-zinc-900",
    ghost: "bg-transparent text-zinc-800 hover:bg-zinc-100",
    danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600",
    outline:
      "border border-zinc-300 bg-white text-zinc-800 shadow-sm hover:bg-zinc-50 active:bg-zinc-100",
  },
  ghostStep: "hover:bg-zinc-100 disabled:opacity-40",
};
