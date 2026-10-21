/**
 * Purpose:
 * Text input primitive with consistent Tailwind styling for forms and dialogs.
 */
"use client";

import type { InputHTMLAttributes } from "react";

import { input } from "@/features/shared/components/Input.style";
import { cx } from "@/features/shared/utils/cx";

export function Input({
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cx(input.base, className)} {...rest} />;
}
