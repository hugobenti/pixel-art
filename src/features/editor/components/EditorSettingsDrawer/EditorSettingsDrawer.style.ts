/**
 * Purpose:
 * Classes for the EditorSettingsDrawer body, its menu rows (icon, label, trailing hint) and the switch rows' layout.
 */

import { cx } from "@/features/shared/utils/cx";

export const editorSettingsDrawer = {
  body: "flex min-h-0 flex-1 flex-col overflow-hidden",
  menuRoot: "min-h-0 flex-1 overflow-y-auto px-0 pt-0 pb-3 sm:pb-4",
  menuList: "flex flex-col divide-y divide-line bg-surface",
  menuRow: cx(
    "flex min-h-12 w-full items-center justify-between gap-3 px-4 py-3",
    "text-left text-sm font-medium text-fg transition-colors",
    "touch-manipulation hover:bg-surface-subtle active:bg-surface-muted",
    "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus",
  ),
  /** Layout for the Switch rows (grid, reference image) so they line up with the menu rows. */
  switchRow: "px-4 py-3",
  rowLead: "flex min-w-0 flex-1 items-center gap-3",
  menuIcon: "h-5 w-5 text-fg-soft",
  menuHint: "shrink-0 text-xs font-normal text-subtle",
};
