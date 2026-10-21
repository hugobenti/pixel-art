/**
 * Purpose:
 * Consistent label stack for forms: label text, control slot, optional hint.
 */
"use client";

import type { ReactNode } from "react";

import { formField } from "@/features/shared/components/FormField.style";
import { cx } from "@/features/shared/utils/cx";

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
  return (
    <label htmlFor={htmlFor} className={cx(formField.base, className)}>
      {label}
      {children}
      {hint ? <span className={formField.hint}>{hint}</span> : null}
    </label>
  );
}
