/**
 * Purpose:
 * Accessible modal shell: backdrop, panel, Escape and optional backdrop dismiss.
 */
"use client";

import { useEffect, useRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";

import { shared } from "@/content/shared";
import {
  type ModalLayer,
  type ModalPlacement,
  type ModalSize,
  modalBackdropClass,
  modalOverlayClasses,
  modalPanelClasses,
} from "@/features/shared/components/modal.styles";
import { useFocusTrap } from "@/features/shared/hooks/useFocusTrap";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  placement?: ModalPlacement;
  size?: ModalSize;
  layer?: ModalLayer;
  backdropBlur?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  overlayClassName?: string;
  panelClassName?: string;
  overlayProps?: Omit<HTMLAttributes<HTMLDivElement>, "children">;
  panelProps?: Omit<HTMLAttributes<HTMLDivElement>, "children">;
}

export function Modal({
  open,
  onClose,
  children,
  placement = "center",
  size = "md",
  layer = "default",
  backdropBlur = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  overlayClassName,
  panelClassName,
  overlayProps,
  panelProps,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(panelRef, open);

  useEffect(() => {
    if (!open || !closeOnEscape) {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeOnEscape, onClose]);

  if (!open) {
    return null;
  }

  const { className: overlayPropClass, ...restOverlay } = overlayProps ?? {};

  const { className: panelPropClass, ...restPanel } = panelProps ?? {};

  const overlayClass = [
    modalOverlayClasses({
      placement,
      layer,
      backdropBlur,
      extra: overlayClassName,
    }),
    overlayPropClass,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  const panelClass = [modalPanelClasses(size, panelClassName), panelPropClass]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    <div className={overlayClass} role="dialog" aria-modal="true" {...restOverlay}>
      {closeOnBackdrop ? (
        <button
          type="button"
          tabIndex={-1}
          aria-label={shared.modal.backdropLabel}
          className={modalBackdropClass}
          onMouseDown={onClose}
        />
      ) : null}
      <div ref={panelRef} className={panelClass} {...restPanel}>
        {children}
      </div>
    </div>
  );
}
