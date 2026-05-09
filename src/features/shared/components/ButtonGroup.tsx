/**
 * Purpose:
 * Visual grouping for adjacent buttons (shared border shell); no semantic coupling to zoom or toolbar.
 */
"use client";

import type { HTMLAttributes, ReactNode } from "react";

const groupClass =
  "flex items-center gap-0.5 rounded-lg border border-zinc-300 bg-white p-0.5 shadow-sm";

interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  "aria-label"?: string;
}

export function ButtonGroup({
  children,
  className = "",
  "aria-label": ariaLabel,
  ...rest
}: ButtonGroupProps) {
  const classes = `${groupClass} ${className}`.trim();
  return (
    <div className={classes} role="group" aria-label={ariaLabel} {...rest}>
      {children}
    </div>
  );
}
