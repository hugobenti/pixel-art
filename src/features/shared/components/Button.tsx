/**
 * Purpose:
 * Accessible button primitive with variants and compact sizes for toolbars (outline/icon/step).
 */
"use client";
import type { TButtonVariant, TButtonSize, TButtonProps } from "./Button.type";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50";

const sizeClasses: Record<TButtonSize, string> = {
  default: "min-h-10 px-3 py-2 text-sm rounded-lg",
  icon: "h-10 min-w-10 shrink-0 rounded-lg px-2 text-base font-semibold",
  step: "h-9 min-w-9 rounded-md text-lg font-semibold leading-none disabled:cursor-not-allowed",
};

const variantClasses: Record<TButtonVariant, string> = {
  primary:
    "bg-accent text-on-accent hover:bg-accent-hover focus-visible:outline-accent",
  ghost: "bg-transparent text-fg-soft hover:bg-surface-muted",
  danger:
    "bg-danger text-on-danger hover:bg-danger-hover focus-visible:outline-danger",
  outline:
    "border border-line-strong bg-surface text-fg-soft shadow-sm hover:bg-surface-subtle active:bg-surface-muted",
};

export function Button({
  variant = "primary",
  size = "default",
  className = "",
  type = "button",
  ...rest
}: TButtonProps) {
  const ghostStepAdjust =
    variant === "ghost" && size === "step"
      ? "hover:bg-surface-muted disabled:opacity-40"
      : "";

  const classes =
    `inline-flex items-center justify-center font-medium transition-colors ${focusRing} ${sizeClasses[size]} ${variantClasses[variant]} ${ghostStepAdjust} ${className}`.trim();

  return <button type={type} className={classes} {...rest} />;
}
