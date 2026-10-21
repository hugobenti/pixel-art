/**
 * Purpose:
 * Global toast stack: top-centered alerts with responsive width, auto-dismiss, and manual dismiss.
 *
 * Notes:
 * Mobile: toast spans the viewport width (with horizontal padding). Desktop: centered with min width cap.
 * Consumers must wrap the app with this provider; use `useToast` from `./hooks/useToast`.
 */
"use client";

import type { ReactNode } from "react";

import { useToastQueue } from "@/features/shared/components/Toast/hooks/useToastQueue";
import { ToastContext } from "@/features/shared/components/Toast/ToastContext";
import { toast as toastStyle } from "@/features/shared/components/Toast/ToastProvider.style";
import { cx } from "@/features/shared/utils/cx";

export type ToastTone = keyof typeof toastStyle.tone;

export interface ToastRecord {
  id: string;
  message: string;
  tone: ToastTone;
}

export interface ShowToastInput {
  message: string;
  tone?: ToastTone;
  durationMs?: number;
  /** When true, skips enqueue if an identical message and tone is already visible. */
  skipDuplicateActiveToast?: boolean;
}

export interface ToastContextValue {
  showToast: (input: ShowToastInput | string) => void;
  dismissToast: (id: string) => void;
}

interface ToastStackProps {
  toasts: Array<ToastRecord & { domId: string }>;
  onDismiss: (id: string) => void;
}

function ToastStack({ toasts, onDismiss }: ToastStackProps) {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className={toastStyle.stack} aria-live="polite" aria-relevant="additions">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          id={toast.domId}
          role="status"
          className={cx(toastStyle.surface, toastStyle.tone[toast.tone])}
        >
          <p className={toastStyle.message}>{toast.message}</p>
          <button
            type="button"
            className={toastStyle.dismiss}
            aria-label="Dismiss notification"
            onClick={() => {
              onDismiss(toast.id);
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const { value, toasts, dismissToast } = useToastQueue();

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}
