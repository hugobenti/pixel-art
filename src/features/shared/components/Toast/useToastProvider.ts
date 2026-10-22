/**
 * Purpose:
 * Toast queue behavior: enqueue with auto-dismiss timers, manual dismiss, timer cleanup, and the render list.
 */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  hasActiveDuplicate,
  normalizeToastInput,
  toastElementId,
  withoutToast,
} from "@/features/shared/logic/toastQueue";
import type { IShowToastInput, IToastRecord } from "./ToastProvider.type";

function createToastId(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function useToastProvider() {
  const [toasts, setToasts] = useState<IToastRecord[]>([]);
  const timersRef = useRef<Map<string, number>>(new Map());

  const dismissToast = useCallback((id: string) => {
    const pending = timersRef.current.get(id);
    if (pending != null) {
      window.clearTimeout(pending);
      timersRef.current.delete(id);
    }
    setToasts((prev) => withoutToast(prev, id));
  }, []);

  const showToast = useCallback(
    (input: IShowToastInput | string) => {
      const { message, tone, durationMs, skipDuplicateActiveToast } = normalizeToastInput(input);
      const id = createToastId();

      setToasts((prev) => {
        if (skipDuplicateActiveToast && hasActiveDuplicate(prev, message, tone)) {
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

  const value = useMemo(() => ({ showToast, dismissToast }), [showToast, dismissToast]);

  const items = useMemo(
    () => toasts.map((toast) => ({ ...toast, elementId: toastElementId(toast.id) })),
    [toasts],
  );

  return { value, items, dismissToast };
}
