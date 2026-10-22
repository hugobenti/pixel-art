/**
 * Purpose:
 * Layer list thumbnail math: paint a layer's indexed pixels 1:1 and size the nearest-neighbor thumbnail.
 *
 * Notes:
 * Palette entries resolved to "transparent" (or missing) are skipped, the same rule as the main canvas.
 */

import type { ILayerPreviewThumbSize, TPixelPaintTarget } from "./layerPreviewRaster.type";

/** Fills one 1×1 rect per opaque pixel of `pixelData` (row-major, `width` × `height`). */
export function paintLayerPixels(
  target: TPixelPaintTarget,
  pixelData: Uint8Array,
  palette: string[],
  width: number,
  height: number,
): void {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const paletteIndex = pixelData[x + y * width];
      const color = palette[paletteIndex] ?? "transparent";
      if (color === "transparent") {
        continue;
      }
      target.fillStyle = color;
      target.fillRect(x, y, 1, 1);
    }
  }
}

/** Thumbnail size whose long edge is `maxEdge`, keeping the artwork's aspect ratio (at least 1 px). */
export function layerPreviewThumbSize(
  artworkWidth: number,
  artworkHeight: number,
  maxEdge: number,
): ILayerPreviewThumbSize {
  const scale = Math.min(maxEdge / artworkWidth, maxEdge / artworkHeight);
  return {
    width: Math.max(1, Math.round(artworkWidth * scale)),
    height: Math.max(1, Math.round(artworkHeight * scale)),
  };
}
