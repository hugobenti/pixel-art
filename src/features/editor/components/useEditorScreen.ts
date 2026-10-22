/**
 * Purpose:
 * EditorScreen behavior: loads the artwork by id into an editable copy, or reports that it is missing.
 */
"use client";

import { useEffect, useState } from "react";

import { editor } from "@/content/editor";
import { toEditableArtwork } from "@/features/editor/logic/editableArtwork";
import type { IArtwork } from "@/features/shared/artwork/artwork.type";
import * as artworkService from "@/features/shared/artwork/artworkService";

export function useEditorScreen(artworkId: string) {
  const [artwork, setArtwork] = useState<IArtwork | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const row = await artworkService.getArtwork(artworkId);
      if (cancelled) {
        return;
      }
      setLoadError(null);
      if (!row) {
        setLoadError(editor.screen.notFound);
        setArtwork(null);
        return;
      }
      setArtwork(toEditableArtwork(row));
    })();
    return () => {
      cancelled = true;
    };
  }, [artworkId]);

  return { artwork, loadError };
}
