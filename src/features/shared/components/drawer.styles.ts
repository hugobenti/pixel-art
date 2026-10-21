/**
 * Purpose:
 * Tailwind classes for the shared right-edge SideDrawer shell (backdrop + sliding panel + header).
 */

export const drawerShellRootClass =
  "fixed inset-0 z-50 flex items-stretch justify-end";

export const drawerBackdropBaseClass =
  "absolute inset-0 bg-scrim/45 transition-opacity";

export const drawerBackdropOpenClass = "opacity-100";

export const drawerBackdropClosedClass = "opacity-0";

export const drawerPanelBaseClass =
  "relative z-10 flex h-full max-h-[100dvh] w-[90%] flex-col overflow-hidden border-l border-line-strong bg-surface pb-[env(safe-area-inset-bottom)] shadow-2xl transition-transform ease-out motion-reduce:transition-opacity sm:w-1/2 sm:max-w-[720px]";

export const drawerPanelOpenClass = "translate-x-0";

export const drawerPanelClosedClass = "translate-x-full motion-reduce:translate-x-0 motion-reduce:opacity-0";

export const drawerHeaderClass =
  "flex shrink-0 items-center justify-between gap-2 border-b border-line px-3 py-3 sm:px-4";

export const drawerTitleClass = "text-base font-semibold text-fg";
