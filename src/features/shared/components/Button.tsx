/**
 * Purpose:
 * Accessible button primitive with variants and compact sizes for toolbars (outline/icon/step).
 */
"use client";

import type { ButtonHTMLAttributes } from "react";

import { button } from "@/features/shared/components/Button.style";
import { cx } from "@/features/shared/utils/cx";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof button.variant;
  size?: keyof typeof button.size;
};

export function Button({
  variant = "primary",
  size = "default",
  className,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        button.base,
        button.size[size],
        button.variant[variant],
        variant === "ghost" && size === "step" && button.ghostStep,
        className
      )}
      {...rest}
    />
  );
}
