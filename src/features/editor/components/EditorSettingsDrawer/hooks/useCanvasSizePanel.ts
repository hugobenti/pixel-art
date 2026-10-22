/**
 * Purpose:
 * Drill-in navigation and state for editor settings subpanels (canvas resize, image detail, etc.).
 */
"use client";

import { useCallback, useState } from "react";

import { editor } from "@/content/editor";
import { resizeArtworkDimensions } from "@/features/editor/logic/resizeCanvas";
import type { TEditorSettingsView, IUseCanvasSizePanelParams } from "./useCanvasSizePanel.type";

export function useCanvasSizePanel({ artwork, onApplyResized }: IUseCanvasSizePanelParams) {
  const [settingsView, setSettingsView] = useState<TEditorSettingsView>("menu");
  const [widthStr, setWidthStr] = useState(String(artwork.width));
  const [heightStr, setHeightStr] = useState(String(artwork.height));

  const openCanvasSize = useCallback(() => {
    setWidthStr(String(artwork.width));
    setHeightStr(String(artwork.height));
    setSettingsView("canvasSize");
  }, [artwork.width, artwork.height]);

  const openImageDetail = useCallback(() => {
    setSettingsView("imageDetail");
  }, []);

  const openImportExport = useCallback(() => {
    setSettingsView("importExport");
  }, []);

  const backToMenu = useCallback(() => {
    setSettingsView("menu");
  }, []);

  const applyCanvasSize = useCallback(
    ({ width: w, height: h }: { width: number; height: number }) => {
      const losesPixels = w < artwork.width || h < artwork.height;
      if (losesPixels) {
        const ok = window.confirm(editor.settings.canvasSize.confirmShrink);
        if (!ok) {
          return;
        }
      }
      const next = resizeArtworkDimensions(artwork, w, h);
      if (next === artwork) {
        setSettingsView("menu");
        return;
      }
      onApplyResized(next);
      setSettingsView("menu");
    },
    [artwork, onApplyResized],
  );

  return {
    settingsView,
    widthStr,
    heightStr,
    setWidthStr,
    setHeightStr,
    openCanvasSize,
    openImageDetail,
    openImportExport,
    backToMenu,
    applyCanvasSize,
  };
}
