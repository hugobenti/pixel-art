/**
 * Purpose:
 * Editor route shell: loads artwork metadata then mounts the interactive workspace.
 */
"use client";

import { useEffect, useState } from "react";

import { EditorWorkspace } from "@/features/editor/components/EditorWorkspace";

import type { Artwork } from "@/features/shared/artwork/artwork.types";

import * as artworkService from "@/features/shared/artwork/artworkService";
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
      <main className="mx-auto max-w-lg px-4 py-16 text-center">
        <p role="alert" className="text-danger-fg">{loadError}</p>
        <a
          href="/gallery"
          className="mt-4 inline-block text-fg-secondary underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Back to gallery
        </a>
      </main>
    );
  }

  if (!artwork) {
    return (
      <main
        role="status"
        className="mx-auto max-w-lg px-4 py-16 text-center text-muted"
      >
        Loading artwork…
      </main>
    );
  }

  return <EditorWorkspace key={artworkId} initialArtwork={artwork} />;
}
