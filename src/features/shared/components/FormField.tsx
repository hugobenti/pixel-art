/**
 * Purpose:
 * Consistent label stack for forms: label text, control slot, optional hint and inline error.
 *
 * Notes:
 * The label is a sibling of the control (not its wrapper), so the hint and error stay out of the
 * control's accessible name; the caller links the error with `aria-describedby` and `aria-invalid`.
 */
"use client";
import { cx } from "@/features/shared/utils/cx";
import { formField } from "./FormField.style";
import type { IFormFieldProps } from "./FormField.type";

export function FormField({
  label,
  htmlFor,
  hint,
  error,
  errorId,
  children,
  className,
}: IFormFieldProps) {
  return (
    <div className={cx(formField.base, className)}>
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {hint ? <span className={formField.hint}>{hint}</span> : null}
      {error ? (
        <p id={errorId} className={formField.error}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
