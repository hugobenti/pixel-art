/**
 * Purpose:
 * Visual grouping for adjacent buttons (shared border shell); no semantic coupling to zoom or toolbar.
 */
"use client";
import type { IButtonGroupProps } from "./ButtonGroup.type";

const groupClass =
  "flex items-center gap-0.5 rounded-lg border border-line-strong bg-surface p-0.5 shadow-sm";

export function ButtonGroup({
  children,
  className = "",
  "aria-label": ariaLabel,
  ...rest
}: IButtonGroupProps) {
  const classes = `${groupClass} ${className}`.trim();
  return (
    <div className={classes} role="group" aria-label={ariaLabel} {...rest}>
      {children}
    </div>
  );
}
