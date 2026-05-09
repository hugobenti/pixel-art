/**
 * Purpose:
 * Consistent label stack for forms: label text, control slot, optional hint.
 */
"use client";

import type { ReactNode } from "react";

const rootClass = "flex flex-col gap-1 text-sm text-zinc-700";

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function FormField({
  label,
  htmlFor,
  hint,
  children,
  className,
}: FormFieldProps) {
  const root = [rootClass, className].filter(Boolean).join(" ").trim();
  return (
    <label htmlFor={htmlFor} className={root}>
      {label}
      {children}
      {hint ? (
        <span className="text-xs font-normal text-zinc-500">{hint}</span>
      ) : null}
    </label>
  );
}
