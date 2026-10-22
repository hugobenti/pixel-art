/**
 * Purpose:
 * Consistent label stack for forms: label text, control slot, optional hint.
 */
"use client";
import { cx } from "@/features/shared/utils/cx";
import { formField } from "./FormField.style";
import type { IFormFieldProps } from "./FormField.type";

export function FormField({ label, htmlFor, hint, children, className }: IFormFieldProps) {
  return (
    <label htmlFor={htmlFor} className={cx(formField.base, className)}>
      {label}
      {children}
      {hint ? <span className={formField.hint}>{hint}</span> : null}
    </label>
  );
}
