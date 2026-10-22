/**
 * Purpose:
 * Regenerates gallery thumbnails saved by the old renderer (fractional scale, seams between pixels)
 * from the artwork's pixel data, so every card shows the art without grid lines.
 *
 * Notes:
 * Runs after the list loads and only touches stale thumbnails; a regenerated one passes
 * isThumbnailCurrent, so it is rendered once. Artworks saved since the PNG renderer are skipped.
 */
"use client";

import { useEffect } from "react";

import type { IArtwork } from "@/features/shared/artwork/artwork.type";
import { artworkToPngThumbnail } from "@/features/shared/artwork/thumbnail";
import { isThumbnailCurrent } from "@/features/shared/artwork/thumbnailFreshness";

export function useStaleThumbnailRefresh(
  artworks: readonly IArtwork[],
  updateThumbnail: (id: string, thumbnail: string) => Promise<void>,
): void {
  useEffect(() => {
    for (const artwork of artworks) {
      if (isThumbnailCurrent(artwork.thumbnail, artwork.width, artwork.height)) {
        continue;
      }
      const thumbnail = artworkToPngThumbnail(artwork);
      if (thumbnail) {
        void updateThumbnail(artwork.id, thumbnail);
      }
    }
  }, [artworks, updateThumbnail]);
}
