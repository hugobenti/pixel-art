/**
 * Purpose:
 * Rasterizes one artwork layer into a small PNG data URL for the layers drawer thumbnail.
 *
 * Notes:
 * Renders the layer at native resolution, then scales down with nearest-neighbor-style drawImage
 * so large canvases and non-square aspect ratios match the main editor’s indexed color rules.
 */

export interface LayerThumbnailSize {
  width: number;
  height: number;
}

/** Thumbnail size that fits the artwork inside `maxEdge` while keeping its aspect ratio (min 1px). */
export function layerThumbnailSize(
  artworkWidth: number,
  artworkHeight: number,
  maxEdge: number,
): LayerThumbnailSize {
  const scale = Math.min(maxEdge / artworkWidth, maxEdge / artworkHeight);
  return {
    width: Math.max(1, Math.round(artworkWidth * scale)),
    height: Math.max(1, Math.round(artworkHeight * scale)),
  };
}

function rasterizeLayerToCanvas(
  pixelData: ArrayLike<number>,
  palette: string[],
  width: number,
  height: number,
): HTMLCanvasElement | null {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return null;
  }
  canvas.width = width;
  canvas.height = height;
  ctx.imageSmoothingEnabled = false;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const paletteIndex = pixelData[x + y * width];
      const color = palette[paletteIndex] ?? "transparent";
      if (color === "transparent") {
        continue;
      }
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    }
  }
  return canvas;
}

function downscaleCanvasNearest(
  source: HTMLCanvasElement,
  artworkWidth: number,
  artworkHeight: number,
  maxEdge: number,
): HTMLCanvasElement {
  const { width: thumbW, height: thumbH } = layerThumbnailSize(
    artworkWidth,
    artworkHeight,
    maxEdge,
  );

  const thumb = document.createElement("canvas");
  const tctx = thumb.getContext("2d");
  if (!tctx) {
    return source;
  }
  thumb.width = thumbW;
  thumb.height = thumbH;
  tctx.imageSmoothingEnabled = false;
  tctx.drawImage(source, 0, 0, artworkWidth, artworkHeight, 0, 0, thumbW, thumbH);
  return thumb;
}

/** PNG data URL of the layer thumbnail, or "" when no DOM/canvas is available. */
export function renderLayerPreviewDataUrl(
  pixelData: ArrayLike<number>,
  palette: string[],
  width: number,
  height: number,
  maxEdge: number,
): string {
  if (typeof document === "undefined") {
    return "";
  }
  const full = rasterizeLayerToCanvas(pixelData, palette, width, height);
  if (!full) {
    return "";
  }
  const thumb = downscaleCanvasNearest(full, width, height, maxEdge);
  try {
    return thumb.toDataURL("image/png");
  } catch {
    return "";
  }
}
