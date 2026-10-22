/**
 * Purpose:
 * Toast queue behavior: enqueue with auto-dismiss timers, manual dismiss, action buttons, timer
 * cleanup, and the render lists split by urgency.
 *
 * Notes:
 * Every timer pauses while the pointer is over the stack or focus is inside it, and resumes with
 * the time it had left once both end (so a toast never vanishes while being read or used).
 */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  hasActiveDuplicate,
  normalizeToastInput,
  remainingAfterPause,
  toastElementId,
  withoutToast,
} from "@/features/shared/logic/toastQueue";
import type {
  IShowToastInput,
  IToastItem,
  IToastRecord,
  IToastTimer,
  TToastHold,
} from "./ToastProvider.type";

function createToastId(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function useToastProvider() {
  const [toasts, setToasts] = useState<IToastRecord[]>([]);
  const timersRef = useRef<Map<string, IToastTimer>>(new Map());

  const dismissToast = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer?.timeoutId != null) {
      window.clearTimeout(timer.timeoutId);
    }
    timersRef.current.delete(id);
    setToasts((prev) => withoutToast(prev, id));
  }, []);

  const runTimer = useCallback(
    (id: string, timer: IToastTimer) => {
      timer.startedAt = Date.now();
      timer.timeoutId = window.setTimeout(() => {
        dismissToast(id);
      }, timer.remainingMs);
    },
    [dismissToast],
  );

  const regionRef = useRef<HTMLDivElement>(null);
  const holdsRef = useRef<Set<TToastHold>>(new Set());

  const setHold = useCallback(
    (hold: TToastHold, on: boolean) => {
      const holds = holdsRef.current;
      const wasHeld = holds.size > 0;
      if (on) {
        holds.add(hold);
      } else {
        holds.delete(hold);
      }
      if (!wasHeld && holds.size > 0) {
        const now = Date.now();
        timersRef.current.forEach((timer) => {
          if (timer.timeoutId != null) {
            window.clearTimeout(timer.timeoutId);
            timer.timeoutId = null;
            timer.remainingMs = remainingAfterPause(timer.remainingMs, timer.startedAt, now);
          }
        });
      } else if (wasHeld && holds.size === 0) {
        timersRef.current.forEach((timer, id) => {
          if (timer.timeoutId == null) {
            runTimer(id, timer);
          }
        });
      }
    },
    [runTimer],
  );

  useEffect(() => {
    const region = regionRef.current;
    if (!region) {
      return;
    }
    const leftRegion = (event: PointerEvent | FocusEvent) =>
      !(event.relatedTarget instanceof Node && region.contains(event.relatedTarget));
    const onPointerOver = () => setHold("hover", true);
    const onPointerOut = (event: PointerEvent) => {
      if (leftRegion(event)) {
        setHold("hover", false);
      }
    };
    const onFocusIn = () => setHold("focus", true);
    const onFocusOut = (event: FocusEvent) => {
      if (leftRegion(event)) {
        setHold("focus", false);
      }
    };
    region.addEventListener("pointerover", onPointerOver);
    region.addEventListener("pointerout", onPointerOut);
    region.addEventListener("focusin", onFocusIn);
    region.addEventListener("focusout", onFocusOut);
    return () => {
      region.removeEventListener("pointerover", onPointerOver);
      region.removeEventListener("pointerout", onPointerOut);
      region.removeEventListener("focusin", onFocusIn);
      region.removeEventListener("focusout", onFocusOut);
    };
  }, [setHold]);

  // A dismissed toast is removed under the pointer or focus without pointerout/focusout; release
  // the holds the remaining stack no longer justifies.
  useEffect(() => {
    const region = regionRef.current;
    if (!region) {
      return;
    }
    if (!region.matches(":hover")) {
      setHold("hover", false);
    }
    if (!region.contains(document.activeElement)) {
      setHold("focus", false);
    }
  }, [toasts, setHold]);

  const showToast = useCallback(
    (input: IShowToastInput | string) => {
      const { message, tone, durationMs, skipDuplicateActiveToast, action } =
        normalizeToastInput(input);
      const id = createToastId();

      setToasts((prev) => {
        if (skipDuplicateActiveToast && hasActiveDuplicate(prev, message, tone)) {
          return prev;
        }
        if (!timersRef.current.has(id)) {
          const timer: IToastTimer = {
            timeoutId: null,
            remainingMs: durationMs,
            startedAt: 0,
          };
          timersRef.current.set(id, timer);
          if (holdsRef.current.size === 0) {
            runTimer(id, timer);
          }
        }
        return [...prev, { id, message, tone, action }];
      });
    },
    [runTimer],
  );

  useEffect(() => {
    const timersMap = timersRef.current;
    return () => {
      timersMap.forEach((timer) => {
        if (timer.timeoutId != null) {
          window.clearTimeout(timer.timeoutId);
        }
      });
      timersMap.clear();
    };
  }, []);

  const value = useMemo(() => ({ showToast, dismissToast }), [showToast, dismissToast]);

  const items = useMemo(
    () =>
      toasts.map((toast): IToastItem => ({
        id: toast.id,
        elementId: toastElementId(toast.id),
        messageId: `${toastElementId(toast.id)}-message`,
        message: toast.message,
        tone: toast.tone,
        actionLabel: toast.action?.label,
        onAction: () => {
          toast.action?.onAction();
          dismissToast(toast.id);
        },
        onDismiss: () => dismissToast(toast.id),
      })),
    [toasts, dismissToast],
  );

  return {
    value,
    regionRef,
    alerts: items.filter((item) => item.tone === "error"),
    statuses: items.filter((item) => item.tone !== "error"),
  };
}
