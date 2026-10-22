/**
 * Purpose:
 * Visual grouping for adjacent buttons (shared border shell); no semantic coupling to zoom or toolbar.
 */
"use client";
import { cx } from "@/features/shared/utils/cx";
import { buttonGroup } from "./ButtonGroup.style";
import type { IButtonGroupProps } from "./ButtonGroup.type";

export function ButtonGroup({
  children,
  className,
  "aria-label": ariaLabel,
  ...rest
}: IButtonGroupProps) {
  return (
    <div className={cx(buttonGroup.base, className)} role="group" aria-label={ariaLabel} {...rest}>
      {children}
    </div>
  );
}
