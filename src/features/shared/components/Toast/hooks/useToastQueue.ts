/**
 * Purpose:
 * Toast queue state for ToastProvider: enqueue with auto-dismiss timers, manual dismiss, cleanup.
 */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type {
  ShowToastInput,
  ToastContextValue,
  ToastRecord,
} from "@/features/shared/components/Toast/ToastProvider";
import { isDuplicateActiveToast, normalizeToastInput } from "@/features/shared/logic/toastQueue";

export function useToastQueue() {
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
      const { message, tone, durationMs, skipDuplicateActiveToast } = normalizeToastInput(input);
      const id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`;

      setToasts((prev) => {
        if (skipDuplicateActiveToast && isDuplicateActiveToast(prev, message, tone)) {
          return prev;
        }
        if (!timersRef.current.has(id)) {
          const tid = window.setTimeout(() => {
            dismissToast(id);
          }, durationMs);
          timersRef.current.set(id, tid);
        }
        return [...prev, { id, message, tone }];
      });
    },
    [dismissToast],
  );

  useEffect(() => {
    const timersMap = timersRef.current;
    return () => {
      timersMap.forEach((tid) => window.clearTimeout(tid));
      timersMap.clear();
    };
  }, []);

  const value = useMemo<ToastContextValue>(
    () => ({ showToast, dismissToast }),
    [showToast, dismissToast],
  );

  const toastViews = useMemo(
    () => toasts.map((toast) => ({ ...toast, domId: `toast-${toast.id}` })),
    [toasts],
  );

  return { value, toasts: toastViews, dismissToast };
}
