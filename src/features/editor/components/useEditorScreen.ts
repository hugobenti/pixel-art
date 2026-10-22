/**
 * Purpose:
 * EditorScreen behavior: loads the artwork by id into an editable copy, or reports that it is missing
 * or could not be read.
 */
"use client";

import { useEffect, useState } from "react";

import { editor } from "@/content/editor";
import { loadEditorArtwork } from "@/features/editor/logic/editorLoad";
import type { IArtwork } from "@/features/shared/artwork/artwork.type";
import * as artworkService from "@/features/shared/artwork/artworkService";

export function useEditorScreen(artworkId: string) {
  const [artwork, setArtwork] = useState<IArtwork | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const result = await loadEditorArtwork(artworkId, artworkService.getArtwork);
      if (cancelled) {
        return;
      }
      if (result.status === "ready") {
        setLoadError(null);
        setArtwork(result.artwork);
        return;
      }
      setArtwork(null);
      setLoadError(
        result.status === "notFound" ? editor.screen.notFound : editor.screen.loadFailed,
      );
    })();
    return () => {
      cancelled = true;
    };
  }, [artworkId]);

  return { artwork, loadError };
}
