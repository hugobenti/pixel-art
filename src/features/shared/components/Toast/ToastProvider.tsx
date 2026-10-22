/**
 * Purpose:
 * Global toast stack: top-centered alerts with responsive width, auto-dismiss, and manual dismiss.
 *
 * Notes:
 * Mobile: toast spans the viewport width (with horizontal padding). Desktop: centered with min width cap.
 * Consumers must wrap the app with this provider; use `useToast` from `./hooks/useToast`.
 */
"use client";

import { shared } from "@/content/shared";
import { cx } from "@/features/shared/utils/cx";

import { ToastContext } from "./ToastContext";
import { toast as toastStyle } from "./ToastProvider.style";
import type { IToastProviderProps, IToastStackProps } from "./ToastProvider.type";
import { useToastProvider } from "./useToastProvider";

function ToastStack({ toasts, onDismiss }: IToastStackProps) {
  return (
    <div className={toastStyle.region} aria-live="polite" aria-relevant="additions">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          id={toast.elementId}
          className={cx(toastStyle.surface, toastStyle.tone[toast.tone])}
        >
          <p className={toastStyle.text}>{toast.message}</p>
          <button
            type="button"
            className={toastStyle.dismiss}
            aria-label={shared.toast.dismissLabel}
            onClick={() => {
              onDismiss(toast.id);
            }}
          >
            {shared.toast.dismissGlyph}
          </button>
        </div>
      ))}
    </div>
  );
}

export function ToastProvider({ children }: IToastProviderProps) {
  const { value, items, dismissToast } = useToastProvider();

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastStack toasts={items} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}
