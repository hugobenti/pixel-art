/**
 * Purpose:
 * Read toast API from context (`showToast`, `dismissToast`) for non-blocking user alerts.
 */
"use client";

import { useContext } from "react";

import {
  ToastContext
} from "@/features/shared/components/Toast/ToastProvider";
import type { IShowToastInput, IToastContextValue, TToastTone } from "@/features/shared/components/Toast/ToastProvider.type";

export type { TToastTone };

export function useToast(): IToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // eslint-disable-next-line no-restricted-syntax -- developer error for a missing provider, never shown in the UI
    throw new Error("useToast must be used within a ToastProvider.");
  }
  return ctx;
}

export type { IShowToastInput };
