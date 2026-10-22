/**
 * Purpose:
 * Pure toast-queue helpers used by the ToastProvider hook: input defaults, duplicate check, removal, DOM ids.
 */

import type {
  IShowToastInput,
  IToastRecord,
  TToastTone,
} from "@/features/shared/components/Toast/ToastProvider.type";

export const DEFAULT_TOAST_DURATION_MS = 4500;

export function normalizeToastInput(input: IShowToastInput | string): Required<IShowToastInput> {
  const normalized = typeof input === "string" ? { message: input } : input;
  return {
    message: normalized.message,
    tone: normalized.tone ?? "neutral",
    durationMs: normalized.durationMs ?? DEFAULT_TOAST_DURATION_MS,
    skipDuplicateActiveToast: normalized.skipDuplicateActiveToast === true,
  };
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
