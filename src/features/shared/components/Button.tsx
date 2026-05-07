/**
 * Purpose:
 * Small accessible button primitive styled with Tailwind utility classes.
 */
"use client";

import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
};

const base =
  "inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50";

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-zinc-900 text-zinc-50 hover:bg-zinc-800 focus-visible:outline-zinc-900",
  ghost:
    "bg-transparent text-zinc-800 hover:bg-zinc-100",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600",
};

export function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...rest
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`.trim();
  return <button type={type} className={classes} {...rest} />;
}
