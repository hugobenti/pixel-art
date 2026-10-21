/**
 * Purpose:
 * Classes for the shared right-edge SideDrawer shell (backdrop + sliding panel + header).
 */

export const sideDrawer = {
  root: "pointer-events-auto fixed inset-0 z-50 flex items-stretch justify-end",
  backdrop: "absolute inset-0 bg-black/45 transition-opacity",
  backdropOpen: "opacity-100",
  backdropClosed: "opacity-0",
  panel:
    "relative z-10 flex h-full max-h-[100dvh] w-[90%] flex-col overflow-hidden border-l border-zinc-300 bg-white pb-[env(safe-area-inset-bottom)] shadow-2xl transition-transform ease-out sm:w-1/2 sm:max-w-[720px]",
  panelOpen: "translate-x-0",
  panelClosed: "translate-x-full",
  header:
    "flex shrink-0 items-center justify-between gap-2 border-b border-zinc-200 px-3 py-3 sm:px-4",
  headerStart: "flex min-w-0 flex-1 items-center gap-2",
  title: "min-w-0 truncate text-base font-semibold text-zinc-900",
  headerIconButton: "shrink-0 touch-manipulation",
  headerIcon: "h-5 w-5 text-zinc-800",
};
