/**
 * Purpose:
 * Modal behavior: Escape to close while open, backdrop dismiss, and panel click isolation.
 */

import { useEffect, type HTMLAttributes, type MouseEvent } from "react";

type DivProps = Omit<HTMLAttributes<HTMLDivElement>, "children">;

interface UseModalOptions {
  open: boolean;
  onClose: () => void;
  closeOnBackdrop: boolean;
  closeOnEscape: boolean;
  overlayProps?: DivProps;
  panelProps?: DivProps;
}

export function useModal({
  open,
  onClose,
  closeOnBackdrop,
  closeOnEscape,
  overlayProps,
  panelProps,
}: UseModalOptions) {
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

  const {
    className: overlayClassName,
    onMouseDown: overlayOnMouseDown,
    ...overlayRest
  } = overlayProps ?? {};

  const {
    className: panelClassName,
    onMouseDown: panelOnMouseDown,
    ...panelRest
  } = panelProps ?? {};

  const onOverlayMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    overlayOnMouseDown?.(e);
    if (!closeOnBackdrop) {
      return;
    }
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const onPanelMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    panelOnMouseDown?.(e);
    e.stopPropagation();
  };

  return {
    overlayClassName,
    overlayRest,
    onOverlayMouseDown,
    panelClassName,
    panelRest,
    onPanelMouseDown,
  };
}
