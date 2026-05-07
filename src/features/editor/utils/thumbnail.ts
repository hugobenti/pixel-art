/**
 * Purpose:
 * Rasterize artwork into a WebP data URL for gallery thumbnails (~150×150).
 */
import { renderCanvas } from "@/features/editor/logic/canvasRender";
import type { Artwork } from "@/features/editor/types/editor.types";
import type { ViewportState } from "@/features/editor/types/editor.types";

const DEFAULT_SIZE = 150;

/**
 * Renders the artwork into a square thumbnail with letterboxing and returns a WebP data URL.
 */
export function artworkToWebpThumbnail(
  artwork: Pick<Artwork, "width" | "height" | "pixelData" | "palette">,
  size = DEFAULT_SIZE
): string {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return "";
  }

  const scale = Math.min(size / artwork.width, size / artwork.height);
  const ox = (size - artwork.width * scale) / 2;
  const oy = (size - artwork.height * scale) / 2;

  const viewport: ViewportState = {
    scale,
    viewOffset: { x: ox, y: oy },
  };

  renderCanvas(ctx, artwork, viewport);

  try {
    return canvas.toDataURL("image/webp", 0.85);
  } catch {
    return canvas.toDataURL("image/png");
  }
}
