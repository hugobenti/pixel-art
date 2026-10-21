/**
 * Purpose:
 * Text input primitive with consistent Tailwind styling for forms and dialogs.
 */
"use client";

import type { InputHTMLAttributes } from "react";

const inputClass =
  "w-full rounded-lg border border-line-strong bg-surface px-3 py-2 text-sm text-fg shadow-sm placeholder:text-subtle focus-visible:border-focus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus";

export function Input({
  className = "",
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) {
  const classes = `${inputClass} ${className}`.trim();
  return <input className={classes} {...rest} />;
}
