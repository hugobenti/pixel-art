/**
 * Purpose:
 * Accessible modal shell: backdrop, panel, Escape and optional backdrop dismiss.
 */
"use client";

import { useEffect } from "react";
import type { HTMLAttributes, ReactNode } from "react";

import {
  type ModalLayer,
  type ModalPlacement,
  type ModalSize,
  modalOverlayClasses,
  modalPanelClasses,
} from "@/features/shared/components/modal.styles";

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

  const {
    className: overlayPropClass,
    onMouseDown: overlayOnMouseDown,
    ...restOverlay
  } = overlayProps ?? {};

  const {
    className: panelPropClass,
    onMouseDown: panelOnMouseDown,
    ...restPanel
  } = panelProps ?? {};

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
    <div
      className={overlayClass}
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        overlayOnMouseDown?.(e);
        if (!closeOnBackdrop) {
          return;
        }
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      {...restOverlay}
    >
      <div
        className={panelClass}
        onMouseDown={(e) => {
          panelOnMouseDown?.(e);
          e.stopPropagation();
        }}
        {...restPanel}
      >
        {children}
      </div>
    </div>
  );
}
