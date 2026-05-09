/**
 * Purpose:
 * Enter/exit motion, Escape-to-close, and backdrop close wiring for the editor settings SideDrawer.
 */
"use client";

import { useEffect } from "react";

import { useLayersDrawerPanel } from "@/features/editor/components/LayersDrawer/useLayersDrawerPanel";

interface UseEditorSettingsDrawerParams {
  onClose: () => void;
}

export function useEditorSettingsDrawer({ onClose }: UseEditorSettingsDrawerParams) {
  const { panelEntered, handleClose } = useLayersDrawerPanel({ onClose });

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleClose]);

  return { panelEntered, handleClose };
}
