/**
 * Purpose:
 * Editor route shell: loads artwork metadata then mounts the interactive workspace.
 */
"use client";

import { useEffect, useState } from "react";

import { EditorWorkspace } from "@/features/editor/components/EditorWorkspace";

import type { Artwork } from "@/features/editor/types/editor.types";

import * as galleryService from "@/features/gallery/services/galleryService";
import { clonePixelBuffer } from "@/features/shared/utils/binaryHelpers";

interface EditorScreenProps {
  artworkId: string;
}

export function EditorScreen({ artworkId }: EditorScreenProps) {
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const row = await galleryService.getArtwork(artworkId);
      if (cancelled) {
        return;
      }
      setLoadError(null);
      if (!row) {
        setLoadError("Artwork not found.");
        setArtwork(null);
        return;
      }
      setArtwork({
        ...row,
        layers: row.layers.map((layer) => ({
          ...layer,
          pixelData: clonePixelBuffer(layer.pixelData),
        })),
        palette: [...row.palette],
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [artworkId]);

  if (loadError) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-red-600">{loadError}</p>
        <a
          href="/gallery"
          className="mt-4 inline-block text-zinc-700 underline"
        >
          Back to gallery
        </a>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-zinc-500">
        Loading artwork…
      </div>
    );
  }

  return <EditorWorkspace key={artworkId} initialArtwork={artwork} />;
}
