/**
 * Purpose:
 * Text input primitive with consistent Tailwind styling for forms and dialogs.
 */
"use client";

import type { InputHTMLAttributes } from "react";

import { cx } from "@/features/shared/utils/cx";
import { input } from "./Input.style";

export function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cx(input.base, className)} {...rest} />;
}
