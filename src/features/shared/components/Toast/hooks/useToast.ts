/**
 * Purpose:
 * Read toast API from context (`showToast`, `dismissToast`) for non-blocking user alerts.
 */
"use client";

import { useContext } from "react";

import {
  ToastContext,
  type ShowToastInput,
  type ToastContextValue,
  type ToastTone,
} from "@/features/shared/components/Toast/ToastProvider";

export type { ToastTone };

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider.");
  }
  return ctx;
}

export type { ShowToastInput };
