/**
 * Purpose:
 * Pure toast-queue helpers used by the ToastProvider hook: input defaults, duplicate check, removal,
 * pause bookkeeping, DOM ids.
 */

import type {
  TNormalizedToastInput,
  IShowToastInput,
  IToastRecord,
  TToastTone,
} from "@/features/shared/components/Toast/ToastProvider.type";

export const DEFAULT_TOAST_DURATION_MS = 4500;
/** Errors and toasts with an action stay long enough to read and act on. */
export const LONG_TOAST_DURATION_MS = 8000;

export function normalizeToastInput(input: IShowToastInput | string): TNormalizedToastInput {
  const normalized = typeof input === "string" ? { message: input } : input;
  const tone = normalized.tone ?? "neutral";
  const long = tone === "error" || normalized.action !== undefined;
  return {
    message: normalized.message,
    tone,
    durationMs:
      normalized.durationMs ?? (long ? LONG_TOAST_DURATION_MS : DEFAULT_TOAST_DURATION_MS),
    skipDuplicateActiveToast: normalized.skipDuplicateActiveToast === true,
    action: normalized.action,
  };
}

/** Time left on an auto-dismiss timer that started at `startedAt` and is paused at `now`. */
export function remainingAfterPause(remainingMs: number, startedAt: number, now: number): number {
  return Math.max(0, remainingMs - (now - startedAt));
}

export function hasActiveDuplicate(
  toasts: readonly IToastRecord[],
  message: string,
  tone: TToastTone,
): boolean {
  return toasts.some((toast) => toast.message === message && toast.tone === tone);
}

export function withoutToast(toasts: readonly IToastRecord[], id: string): IToastRecord[] {
  return toasts.filter((toast) => toast.id !== id);
}

export function toastElementId(id: string): string {
  return `toast-${id}`;
}
