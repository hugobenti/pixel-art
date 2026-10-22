/**
 * Purpose:
 * Rasterize artwork into a lossless PNG data URL for gallery thumbnails.
 *
 * Notes:
 * The canvas is the artwork at an integer scale (see thumbnailScale), keeping its aspect ratio, so each
 * art pixel is a whole block with no seams; the gallery upscales it with `image-rendering: pixelated`.
 */
import { renderCanvas } from "@/features/shared/artwork/canvasRender";
import { thumbnailScale } from "@/features/shared/artwork/thumbnailScale";
import type { IArtwork } from "@/features/shared/artwork/artwork.type";

/**
 * Renders the visible layers at an integer scale and returns a PNG data URL ("" without a 2D context).
 */
export function artworkToPngThumbnail(
  artwork: Pick<IArtwork, "width" | "height" | "layers" | "palette">,
): string {
  const scale = thumbnailScale(artwork.width, artwork.height);
  const canvas = document.createElement("canvas");
  canvas.width = artwork.width * scale;
  canvas.height = artwork.height * scale;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return "";
  }

  renderCanvas(ctx, artwork, { scale, viewOffset: { x: 0, y: 0 } });
  return canvas.toDataURL("image/png");
}
