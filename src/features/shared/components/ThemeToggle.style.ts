/**
 * Purpose:
 * Classes for ThemeToggle: a segmented System / Light / Dark control built on native radios.
 */

import { cx } from "@/features/shared/utils/cx";

export const themeToggle = {
  base: "flex items-center gap-3",
  variant: {
    /** Compact, label for screen readers only (page headers). */
    inline: "",
    /** Full-width settings row with a visible label (drawer menus). */
    row: "min-h-12 w-full justify-between px-4 py-3",
  },
  label: {
    inline: "sr-only",
    row: "text-sm font-medium text-fg",
  },
  track: "inline-flex rounded-lg border border-line bg-surface-muted p-0.5",
  input: "peer sr-only",
  option: cx(
    "block min-h-9 cursor-pointer rounded-md px-3 py-2 text-sm leading-5 font-medium text-muted transition-colors",
    "hover:text-fg",
    "peer-checked:bg-surface peer-checked:text-fg peer-checked:shadow-sm",
    "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-1 peer-focus-visible:outline-focus",
  ),
};
