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
  useState,
  type ReactNode,
} from "react";

export type ToastTone = "neutral" | "success" | "error";

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

export const ToastContext = createContext<ToastContextValue | null>(null);

const DEFAULT_DURATION_MS = 4500;

const stackRegionClass = `
  pointer-events-none fixed inset-x-0 top-0 z-[100]
  flex flex-col items-center gap-2
  px-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-4
`;

function toastSurfaceClass(tone: ToastTone): string {
  const base =
    "pointer-events-auto flex min-h-12 w-full max-w-lg items-start gap-3 rounded-lg border px-4 py-3 shadow-lg sm:min-w-[280px]";

  if (tone === "success") {
    return `${base} border-green-200 bg-green-50 text-green-950`;
  }
  if (tone === "error") {
    return `${base} border-red-200 bg-red-50 text-red-950`;
  }
  return `${base} border-zinc-200 bg-white text-zinc-900`;
}

const messageClass =
  "min-w-0 flex-1 text-sm font-medium leading-snug";

const dismissButtonClass =
  "shrink-0 rounded-md px-1.5 py-0.5 text-lg leading-none text-current opacity-70 hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

interface ToastStackProps {
  toasts: ToastRecord[];
  onDismiss: (id: string) => void;
}

function ToastStack({ toasts, onDismiss }: ToastStackProps) {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className={stackRegionClass} aria-live="polite" aria-relevant="additions">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          id={`toast-${toast.id}`}
          role="status"
          className={toastSurfaceClass(toast.tone)}
        >
          <p className={messageClass}>{toast.message}</p>
          <button
            type="button"
            className={dismissButtonClass}
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
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
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
    (input: ShowToastInput | string) => {
      const normalized: ShowToastInput =
        typeof input === "string" ? { message: input } : input;
      const id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const tone: ToastTone = normalized.tone ?? "neutral";
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
