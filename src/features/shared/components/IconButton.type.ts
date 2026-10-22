import type { ButtonHTMLAttributes } from "react";

export type TIconButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "type" | "title" | "aria-label" | "aria-pressed"
> & {
  /** Root-relative SVG from PUBLIC_ICONS. */
  icon: string;
  /** Accessible name; also the tooltip. */
  label: string;
  /** Keyboard shortcut appended to the tooltip, e.g. "Ctrl+Z". */
  shortcut?: string;
  /** Set for toggles: renders aria-pressed and the pressed style. Leave undefined for plain actions. */
  pressed?: boolean;
};
