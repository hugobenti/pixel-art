/**
 * Purpose:
 * Classes for the ColorSwatch chip: footprint per density, selection rings and the keyboard-focus outline.
 */

import { focusRing } from "@/features/shared/components/focus.style";
import { cx } from "@/features/shared/utils/cx";

export const colorSwatch = {
  density: {
    comfortable: cx("h-10 w-10 shrink-0 rounded-md", focusRing),
    compact: cx("h-9 w-9 rounded-md", focusRing),
  },
  ring: {
    idle: "ring-1 ring-control-border",
    selected: "ring-2 ring-pick-primary ring-offset-2 ring-offset-surface",
    primary: "ring-2 ring-pick-primary ring-offset-2 ring-offset-bg",
    secondary: "ring-2 ring-pick-secondary ring-offset-2 ring-offset-bg",
    both: "ring-2 ring-accent ring-offset-2 ring-offset-bg",
  },
  /** Roving keyboard position in the comfortable row. */
  focused: "outline outline-2 outline-offset-2 outline-dashed outline-focus",
};
