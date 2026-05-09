/**
 * Purpose:
 * Enter/exit motion, Escape-to-close, and backdrop close wiring for the editor settings SideDrawer.
 */
"use client";

import { useEffect } from "react";

import { useLayersDrawerPanel } from "@/features/editor/components/LayersDrawer/useLayersDrawerPanel";

interface UseEditorSettingsDrawerParams {
  onClose: () => void;
  /** When true is returned, Escape does not close the drawer (e.g. drill-in navigates back first). */
  interceptEscape?: () => boolean;
}

export function useEditorSettingsDrawer({
  onClose,
  interceptEscape,
}: UseEditorSettingsDrawerParams) {
  const { panelEntered, handleClose } = useLayersDrawerPanel({ onClose });

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }
      if (interceptEscape?.()) {
        return;
      }
      handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleClose, interceptEscape]);

  return { panelEntered, handleClose };
}
