/**
 * Purpose:
 * Accessible modal shell: backdrop, panel, Escape and optional backdrop dismiss.
 */
"use client";

import { shared } from "@/content/shared";
import { cx } from "@/features/shared/utils/cx";
import { modal } from "./Modal.style";
import type { IModalProps } from "./Modal.type";
import { useModal } from "./useModal";

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
}: IModalProps) {
  const { panelRef } = useModal({ open, closeOnEscape, onClose });

  if (!open) {
    return null;
  }

  const { className: overlayPropClass, ...restOverlay } = overlayProps ?? {};
  const { className: panelPropClass, ...restPanel } = panelProps ?? {};

  return (
    <div
      className={cx(
        modal.overlay,
        modal.layer[layer],
        modal.placement[placement],
        backdropBlur && modal.blur,
        overlayClassName,
        overlayPropClass,
      )}
      role="dialog"
      aria-modal="true"
      {...restOverlay}
    >
      {closeOnBackdrop ? (
        <button
          type="button"
          tabIndex={-1}
          aria-label={shared.modal.backdropLabel}
          className={modal.backdrop}
          onMouseDown={onClose}
        />
      ) : null}
      <div
        ref={panelRef}
        className={cx(modal.size[size], panelClassName, panelPropClass)}
        {...restPanel}
      >
        {children}
      </div>
    </div>
  );
}
