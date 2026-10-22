/**
 * Purpose:
 * Detached copy of a stored artwork for the editor, so edits never mutate the loaded record.
 */

import type { IArtwork } from "@/features/shared/artwork/artwork.type";
import { clonePixelBuffer } from "@/features/shared/utils/binaryHelpers";

/** Copies the palette and every layer's pixel buffer; other fields are carried over as is. */
export function toEditableArtwork(stored: IArtwork): IArtwork {
  return {
    ...stored,
    layers: stored.layers.map((layer) => ({
      ...layer,
      pixelData: clonePixelBuffer(layer.pixelData),
    })),
    palette: [...stored.palette],
  };
}
