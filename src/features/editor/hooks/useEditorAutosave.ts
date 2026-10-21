/**
 * Purpose:
 * Debounced IndexedDB persistence for the open artwork plus a final save on editor unmount.
 *
 * Notes:
 * Shares one implementation path for thumbnail encoding and artworkService.saveArtwork (DRY).
 */
"use client";

import { useCallback, useEffect, useRef } from "react";

import * as artworkService from "@/features/shared/artwork/artworkService";
import { artworkToWebpThumbnail } from "@/features/editor/utils/thumbnail";
import type { IUseEditorAutosaveParams } from "./useEditorAutosave.type";

const AUTOSAVE_DEBOUNCE_MS = 650;

export function useEditorAutosave({
  artworkRef,
  artworkId,
  paintRevision,
  historyRevision,
}: IUseEditorAutosaveParams) {
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
