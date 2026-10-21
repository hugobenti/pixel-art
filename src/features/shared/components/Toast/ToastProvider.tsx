/**
 * Purpose:
 * Global toast stack: top-centered alerts with responsive width, auto-dismiss, and manual dismiss.
 *
 * Notes:
 * Mobile: toast spans the viewport width (with horizontal padding). Desktop: centered with min width cap.
 * Consumers must wrap the app with this provider; use `useToast` from `./hooks/useToast`.
 */
"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

import { shared } from "@/content/shared";
import type { TToastTone, IToastRecord, IShowToastInput, IToastContextValue, IToastStackProps, IToastProviderProps } from "./ToastProvider.type";

export const ToastContext = createContext<IToastContextValue | null>(null);

const DEFAULT_DURATION_MS = 4500;

const stackRegionClass = `
  pointer-events-none fixed inset-x-0 top-0 z-[100]
  flex flex-col items-center gap-2
  px-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-4
`;

function toastSurfaceClass(tone: TToastTone): string {
  const base =
    "pointer-events-auto flex min-h-12 w-full max-w-lg items-start gap-3 rounded-lg border px-4 py-3 shadow-lg sm:min-w-[280px]";

  if (tone === "success") {
    return `${base} border-success-line bg-success-surface text-success-fg`;
  }
  if (tone === "error") {
    return `${base} border-danger-line bg-danger-surface text-danger-fg-strong`;
  }
  return `${base} border-line bg-surface text-fg`;
}

const messageClass =
  "min-w-0 flex-1 text-sm font-medium leading-snug";

const dismissButtonClass =
  "shrink-0 rounded-md px-1.5 py-0.5 text-lg leading-none text-current opacity-70 hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

function ToastStack({ toasts, onDismiss }: IToastStackProps) {
  return (
    <div className={stackRegionClass} aria-live="polite" aria-relevant="additions">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          id={`toast-${toast.id}`}
          className={toastSurfaceClass(toast.tone)}
        >
          <p className={messageClass}>{toast.message}</p>
          <button
            type="button"
            className={dismissButtonClass}
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
  const [toasts, setToasts] = useState<IToastRecord[]>([]);
  const timersRef = useRef<Map<string, number>>(new Map());

  const dismissToast = useCallback((id: string) => {
    const pending = timersRef.current.get(id);
    if (pending != null) {
      window.clearTimeout(pending);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (input: IShowToastInput | string) => {
      const normalized: IShowToastInput =
        typeof input === "string" ? { message: input } : input;
      const id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const tone: TToastTone = normalized.tone ?? "neutral";
      const durationMs = normalized.durationMs ?? DEFAULT_DURATION_MS;
      const skipDup = normalized.skipDuplicateActiveToast === true;

      setToasts((prev) => {
        if (
          skipDup &&
          prev.some((t) => t.message === normalized.message && t.tone === tone)
        ) {
          return prev;
        }
        if (!timersRef.current.has(id)) {
          const tid = window.setTimeout(() => {
            dismissToast(id);
          }, durationMs);
          timersRef.current.set(id, tid);
        }
        return [...prev, { id, message: normalized.message, tone }];
      });
    },
    [dismissToast]
  );

  useEffect(() => {
    const timersMap = timersRef.current;
    return () => {
      timersMap.forEach((tid) => window.clearTimeout(tid));
      timersMap.clear();
    };
  }, []);

  const value = useMemo(
    () => ({ showToast, dismissToast }),
    [showToast, dismissToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}
