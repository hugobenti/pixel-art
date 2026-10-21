/**
 * Purpose:
 * Pure toast queue rules: input normalization (string or options) and duplicate detection.
 */

import type {
  ShowToastInput,
  ToastRecord,
  ToastTone,
} from "@/features/shared/components/Toast/ToastProvider";

export const DEFAULT_TOAST_DURATION_MS = 4500;

export function normalizeToastInput(input: ShowToastInput | string) {
  const normalized: ShowToastInput = typeof input === "string" ? { message: input } : input;
  return {
    message: normalized.message,
    tone: normalized.tone ?? ("neutral" as ToastTone),
    durationMs: normalized.durationMs ?? DEFAULT_TOAST_DURATION_MS,
    skipDuplicateActiveToast: normalized.skipDuplicateActiveToast === true,
  };
}

export function isDuplicateActiveToast(
  toasts: ToastRecord[],
  message: string,
  tone: ToastTone,
): boolean {
  return toasts.some((t) => t.message === message && t.tone === tone);
}
