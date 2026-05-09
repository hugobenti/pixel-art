/**
 * Purpose:
 * Drill-in state, numeric inputs, validation, crop confirmation, and apply for canvas resize in settings.
 */
"use client";

import { useCallback, useState } from "react";

import { resizeArtworkDimensions } from "@/features/editor/logic/resizeCanvas";
import type { Artwork } from "@/features/editor/types/editor.types";
import { validateDimensions } from "@/features/gallery/services/galleryService";

export type EditorSettingsView = "menu" | "canvasSize";

interface UseCanvasSizePanelParams {
  artwork: Artwork;
  onApplyResized: (next: Artwork) => void;
}

export function useCanvasSizePanel({
  artwork,
  onApplyResized,
}: UseCanvasSizePanelParams) {
  const [settingsView, setSettingsView] = useState<EditorSettingsView>("menu");
  const [widthStr, setWidthStr] = useState(String(artwork.width));
  const [heightStr, setHeightStr] = useState(String(artwork.height));

  const openCanvasSize = useCallback(() => {
    setWidthStr(String(artwork.width));
    setHeightStr(String(artwork.height));
    setSettingsView("canvasSize");
  }, [artwork.width, artwork.height]);

  const backToMenu = useCallback(() => {
    setSettingsView("menu");
  }, []);

  const applyCanvasSize = useCallback(() => {
    const w = Number.parseInt(widthStr, 10);
    const h = Number.parseInt(heightStr, 10);
    if (!Number.isFinite(w) || !Number.isFinite(h)) {
      return;
    }
    try {
      validateDimensions(w, h);
    } catch {
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
  }, [widthStr, heightStr, artwork, onApplyResized]);

  return {
    settingsView,
    widthStr,
    heightStr,
    setWidthStr,
    setHeightStr,
    openCanvasSize,
    backToMenu,
    applyCanvasSize,
  };
}
