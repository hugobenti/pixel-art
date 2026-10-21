/**
 * Purpose:
 * Text input primitive with consistent Tailwind styling for forms and dialogs.
 */
"use client";

import type { InputHTMLAttributes } from "react";

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus-visible:border-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400";

export function Input({
  className = "",
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) {
  const classes = `${inputClass} ${className}`.trim();
  return <input className={classes} {...rest} />;
}
