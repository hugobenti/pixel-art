/**
 * Purpose:
 * Classes for the global toast stack and toast surfaces per tone.
 */

export const toast = {
  stack:
    "pointer-events-none fixed inset-x-0 top-0 z-[100] flex flex-col items-center gap-2 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-4",
  surface:
    "pointer-events-auto flex min-h-12 w-full max-w-lg items-start gap-3 rounded-lg border px-4 py-3 shadow-lg sm:min-w-[280px]",
  tone: {
    neutral: "border-zinc-200 bg-white text-zinc-900",
    success: "border-green-200 bg-green-50 text-green-950",
    error: "border-red-200 bg-red-50 text-red-950",
  },
  message: "min-w-0 flex-1 text-sm font-medium leading-snug",
  dismiss:
    "shrink-0 rounded-md px-1.5 py-0.5 text-lg leading-none text-current opacity-70 hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
};
