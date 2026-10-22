/**
 * Purpose:
 * Accessible button primitive with variants and compact sizes for toolbars (outline/icon/step).
 */
"use client";
import { cx } from "@/features/shared/utils/cx";
import { button } from "./Button.style";
import type { TButtonProps } from "./Button.type";

export function Button({
  variant = "primary",
  size = "default",
  className,
  type = "button",
  ...rest
}: TButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        button.base,
        button.size[size],
        button.variant[variant],
        variant === "ghost" && size === "step" && button.ghostStep,
        className,
      )}
      {...rest}
    />
  );
}
