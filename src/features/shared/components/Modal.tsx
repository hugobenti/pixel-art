/**
 * Purpose:
 * Accessible modal shell: backdrop, panel, Escape and optional backdrop dismiss.
 */
"use client";

import type { HTMLAttributes, ReactNode } from "react";

import { modal } from "@/features/shared/components/Modal.style";
import { useModal } from "@/features/shared/components/useModal";
import { cx } from "@/features/shared/utils/cx";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  placement?: keyof typeof modal.placement;
  size?: keyof typeof modal.size;
  layer?: keyof typeof modal.layer;
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
  const {
    overlayClassName: overlayPropClass,
    overlayRest,
    onOverlayMouseDown,
    panelClassName: panelPropClass,
    panelRest,
    onPanelMouseDown,
  } = useModal({
    open,
    onClose,
    closeOnBackdrop,
    closeOnEscape,
    overlayProps,
    panelProps,
  });

  if (!open) {
    return null;
  }

  return (
    <div
      className={cx(
        modal.overlay,
        modal.layer[layer],
        modal.placement[placement],
        backdropBlur && modal.backdropBlur,
        overlayClassName,
        overlayPropClass
      )}
      role="dialog"
      aria-modal="true"
      onMouseDown={onOverlayMouseDown}
      {...overlayRest}
    >
      <div
        className={cx(modal.size[size], panelClassName, panelPropClass)}
        onMouseDown={onPanelMouseDown}
        {...panelRest}
      >
        {children}
      </div>
    </div>
  );
}
