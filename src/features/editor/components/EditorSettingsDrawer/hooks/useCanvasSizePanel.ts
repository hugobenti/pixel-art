/**
 * Purpose:
 * Drill-in navigation and state for editor settings subpanels (canvas resize, image detail, etc.).
 */
"use client";

import { useCallback, useState } from "react";

import { resizeArtworkDimensions } from "@/features/editor/logic/resizeCanvas";
import type { Artwork } from "@/features/editor/types/editor.types";
import { useToast } from "@/features/shared/components/Toast/hooks/useToast";
import { validateDimensions } from "@/features/gallery/services/galleryService";

export type EditorSettingsView =
  | "menu"
  | "canvasSize"
  | "imageDetail"
  | "importExport";

interface UseCanvasSizePanelParams {
  artwork: Artwork;
  onApplyResized: (next: Artwork) => void;
}

export function useCanvasSizePanel({
  artwork,
  onApplyResized,
}: UseCanvasSizePanelParams) {
  const { showToast } = useToast();
  const [settingsView, setSettingsView] = useState<EditorSettingsView>("menu");
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

  const applyCanvasSize = useCallback(() => {
    const w = Number.parseInt(widthStr, 10);
    const h = Number.parseInt(heightStr, 10);
    if (!Number.isFinite(w) || !Number.isFinite(h)) {
      showToast({
        message: "Enter valid width and height.",
        tone: "error",
      });
      return;
    }
    try {
      validateDimensions(w, h);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Dimensions are out of range.";
      showToast({ message, tone: "error" });
      return;
    }
    const losesPixels = w < artwork.width || h < artwork.height;
    if (losesPixels) {
      const ok = window.confirm(
        "A smaller canvas permanently removes pixels outside the top-left region. Continue?"
      );
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
  }, [widthStr, heightStr, artwork, onApplyResized, showToast]);

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
