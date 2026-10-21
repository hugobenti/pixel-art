/**
 * Purpose:
 * Detach a loaded artwork from stored buffers so editor mutations never alias persisted data.
 */

import type { Artwork } from "@/features/shared/artwork/artwork.types";

import { clonePixelBuffer } from "@/features/shared/utils/binaryHelpers";

export function cloneArtworkForEditing(row: Artwork): Artwork {
  return {
    ...row,
    layers: row.layers.map((layer) => ({
      ...layer,
      pixelData: clonePixelBuffer(layer.pixelData),
    })),
    palette: [...row.palette],
  };
}
