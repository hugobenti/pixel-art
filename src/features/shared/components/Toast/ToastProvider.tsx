/**
 * Purpose:
 * Global toast stack: errors as alerts, other tones in a polite live region; optional action button
 * (e.g. Undo), icon dismiss, and auto-dismiss that pauses while the stack is hovered or focused.
 *
 * Notes:
 * Phones: bottom of the viewport, full width minus padding. From `sm`: top-centered with a min width.
 * Consumers must wrap the app with this provider; use `useToast` from `./hooks/useToast`.
 */
"use client";

import { shared } from "@/content/shared";
import { PublicMaskIcon } from "@/features/shared/components/PublicMaskIcon";
import { PUBLIC_ICONS } from "@/features/shared/constants/publicIcons";
import { cx } from "@/features/shared/utils/cx";

import { ToastContext } from "./ToastContext";
import { toast as toastStyle } from "./ToastProvider.style";
import type { IToastItemProps, IToastProviderProps, IToastStackProps } from "./ToastProvider.type";
import { useToastProvider } from "./useToastProvider";

function ToastItem({ toast }: IToastItemProps) {
  return (
    <div
      id={toast.elementId}
      role="group"
      aria-labelledby={toast.messageId}
      className={cx(toastStyle.surface, toastStyle.tone[toast.tone])}
    >
      <p
        id={toast.messageId}
        role={toast.tone === "error" ? "alert" : undefined}
        className={toastStyle.text}
      >
        {toast.message}
      </p>
      {toast.actionLabel ? (
        <button type="button" className={toastStyle.action} onClick={toast.onAction}>
          {toast.actionLabel}
        </button>
      ) : null}
      <button
        type="button"
        className={toastStyle.dismiss}
        aria-label={shared.toast.dismissLabel}
        onClick={toast.onDismiss}
      >
        <PublicMaskIcon src={PUBLIC_ICONS.xMark} className={toastStyle.dismissIcon} />
      </button>
    </div>
  );
}

function ToastStack({ alerts, statuses, regionRef }: IToastStackProps) {
  return (
    <div ref={regionRef} className={toastStyle.region}>
      <div className={toastStyle.alertList}>
        {alerts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </div>
      <div className={toastStyle.statusList} aria-live="polite" aria-relevant="additions">
        {statuses.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </div>
    </div>
  );
}

export function ToastProvider({ children }: IToastProviderProps) {
  const { value, regionRef, alerts, statuses } = useToastProvider();

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastStack alerts={alerts} statuses={statuses} regionRef={regionRef} />
    </ToastContext.Provider>
  );
}
