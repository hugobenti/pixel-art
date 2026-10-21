/**
 * Purpose:
 * Consistent label stack for forms: label text, control slot, optional hint.
 */
"use client";
import type { IFormFieldProps } from "./FormField.type";

const rootClass = "flex flex-col gap-1 text-sm text-fg-secondary";

export function FormField({
  label,
  htmlFor,
  hint,
  children,
  className,
}: IFormFieldProps) {
  const root = [rootClass, className].filter(Boolean).join(" ").trim();
  return (
    <label htmlFor={htmlFor} className={root}>
      {label}
      {children}
      {hint ? (
        <span className="text-xs font-normal text-subtle">{hint}</span>
      ) : null}
    </label>
  );
}
