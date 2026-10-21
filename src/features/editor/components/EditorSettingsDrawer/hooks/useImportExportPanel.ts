/**
 * Purpose:
 * Handle export actions for the editor settings file transfer panel.
 */
"use client";

import { useCallback } from "react";

import { editor } from "@/content/editor";
import {
  exportArtworkAsJson,
  exportArtworkAsPng,
} from "@/features/shared/artwork/artworkFileService";
import type { Artwork } from "@/features/shared/artwork/artwork.types";
import { useToast } from "@/features/shared/components/Toast/hooks/useToast";

interface UseImportExportPanelParams {
  artwork: Artwork;
}

export function useImportExportPanel({
  artwork,
}: UseImportExportPanelParams) {
  const { showToast } = useToast();

  const exportJson = useCallback(() => {
    exportArtworkAsJson(artwork);
    showToast({ message: editor.settings.export.jsonDone, tone: "success" });
  }, [artwork, showToast]);

  const exportPng = useCallback(async () => {
    try {
      await exportArtworkAsPng(artwork);
      showToast({ message: editor.settings.export.pngDone, tone: "success" });
    } catch (error) {
      const message = error instanceof Error ? error.message : editor.settings.export.pngFailed;
      showToast({ message, tone: "error" });
    }
  }, [artwork, showToast]);

  return {
    exportJson,
    exportPng,
  };
}
