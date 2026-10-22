/**
 * Purpose:
 * Modal behavior: traps focus in the panel while open and closes on Escape when enabled.
 */
"use client";

import { useEffect, useRef } from "react";

import { useFocusTrap } from "@/features/shared/hooks/useFocusTrap";
import type { IUseModalInput } from "./Modal.type";

export function useModal({ open, closeOnEscape, onClose }: IUseModalInput) {
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

  return { panelRef };
}
