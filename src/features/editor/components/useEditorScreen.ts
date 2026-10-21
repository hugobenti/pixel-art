/**
 * Purpose:
 * Loads the artwork for the editor route and exposes loading / not-found / ready state.
 */

import { useEffect, useState } from "react";

import type { Artwork } from "@/features/shared/artwork/artwork.types";

import { cloneArtworkForEditing } from "@/features/editor/logic/cloneArtworkForEditing";
import * as artworkService from "@/features/shared/artwork/artworkService";

export function useEditorScreen(artworkId: string) {
  const [artwork, setArtwork] = useState<Artwork | null>(null);
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
        setLoadError("Artwork not found.");
        setArtwork(null);
        return;
      }
      setArtwork(cloneArtworkForEditing(row));
    })();
    return () => {
      cancelled = true;
    };
  }, [artworkId]);

  return { artwork, loadError };
}
