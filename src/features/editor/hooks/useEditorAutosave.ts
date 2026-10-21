/**
 * Purpose:
 * Debounced IndexedDB persistence for the open artwork plus a final save on editor unmount.
 *
 * Notes:
 * Shares one implementation path for thumbnail encoding and artworkService.saveArtwork (DRY).
 */
"use client";

import { type RefObject, useCallback, useEffect, useRef } from "react";

import * as artworkService from "@/features/shared/artwork/artworkService";

import type { Artwork } from "@/features/shared/artwork/artwork.types";
import { artworkToWebpThumbnail } from "@/features/editor/utils/thumbnail";

const AUTOSAVE_DEBOUNCE_MS = 650;

export interface UseEditorAutosaveParams {
  artworkRef: RefObject<Artwork>;
  artworkId: string;
  paintRevision: number;
  historyRevision: number;
}

export function useEditorAutosave({
  artworkRef,
  artworkId,
  paintRevision,
  historyRevision,
}: UseEditorAutosaveParams) {
  const persistCurrent = useCallback(() => {
    const current = artworkRef.current;
    if (!current || typeof document === "undefined") {
      return;
    }
    const thumb = artworkToWebpThumbnail(current);
    void artworkService.saveArtwork({
      ...current,
      thumbnail: thumb || current.thumbnail,
    });
  }, [artworkRef]);

  const skipInitialAutosave = useRef(true);

  useEffect(() => {
    if (skipInitialAutosave.current) {
      skipInitialAutosave.current = false;
      return;
    }
    const handle = window.setTimeout(persistCurrent, AUTOSAVE_DEBOUNCE_MS);
    return () => window.clearTimeout(handle);
  }, [artworkId, paintRevision, historyRevision, persistCurrent]);

  useEffect(() => {
    return () => {
      persistCurrent();
    };
  }, [persistCurrent]);
}
