/**
 * Purpose:
 * Visual grouping for adjacent buttons (shared border shell); no semantic coupling to zoom or toolbar.
 */
"use client";

import type { HTMLAttributes, ReactNode } from "react";

import { buttonGroup } from "@/features/shared/components/ButtonGroup.style";
import { cx } from "@/features/shared/utils/cx";

interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  "aria-label"?: string;
}

export function ButtonGroup({
  children,
  className,
  "aria-label": ariaLabel,
  ...rest
}: ButtonGroupProps) {
  return (
    <div
      className={cx(buttonGroup.base, className)}
      role="group"
      aria-label={ariaLabel}
      {...rest}
    >
      {children}
    </div>
  );
}
