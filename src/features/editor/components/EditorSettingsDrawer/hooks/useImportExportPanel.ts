/**
 * Purpose:
 * Handle export actions for the editor settings file transfer panel.
 */
"use client";

import { useCallback } from "react";

import {
  exportArtworkAsJson,
  exportArtworkAsPng,
} from "@/features/editor/services/artworkFileService";
import type { Artwork } from "@/features/editor/types/editor.types";
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
    showToast({ message: "JSON file exported.", tone: "success" });
  }, [artwork, showToast]);

  const exportPng = useCallback(async () => {
    try {
      await exportArtworkAsPng(artwork);
      showToast({ message: "PNG file exported.", tone: "success" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to export PNG.";
      showToast({ message, tone: "error" });
    }
  }, [artwork, showToast]);

  return {
    exportJson,
    exportPng,
  };
}
