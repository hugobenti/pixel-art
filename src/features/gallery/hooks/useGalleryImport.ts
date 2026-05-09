/**
 * Purpose:
 * Manage gallery-side JSON import flow and hidden file input wiring.
 */
"use client";

import { useCallback, useRef } from "react";

import { importArtworkFromJsonFile } from "@/features/editor/services/artworkFileService";
import { useToast } from "@/features/shared/components/Toast/hooks/useToast";

import type { Artwork } from "@/features/editor/types/editor.types";
import type { ImportedArtworkData } from "@/features/editor/services/artworkFileService";

interface UseGalleryImportParams {
  importArtwork: (input: ImportedArtworkData) => Promise<Artwork | null>;
  onImported: (artwork: Artwork) => void;
}

export function useGalleryImport({ importArtwork, onImported }: UseGalleryImportParams) {
  const { showToast } = useToast();
  const importInputRef = useRef<HTMLInputElement | null>(null);

  const openImportPicker = useCallback(() => {
    importInputRef.current?.click();
  }, []);

  const onImportFile = useCallback(
    async (file: File | null) => {
      if (!file) {
        return;
      }
      try {
        const importedData = await importArtworkFromJsonFile(file);
        const created = await importArtwork(importedData);
        if (!created) {
          return;
        }
        showToast({ message: "Artwork imported.", tone: "success" });
        onImported(created);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Could not import JSON file.";
        showToast({ message, tone: "error" });
      }
    },
    [importArtwork, onImported, showToast]
  );

  return { importInputRef, openImportPicker, onImportFile };
}
