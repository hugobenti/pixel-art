/**
 * Purpose:
 * Small raster preview for a single artwork layer in the layers list.
 *
 * Notes:
 * Renders the layer at native resolution, then scales down with nearest-neighbor-style drawImage
 * so large canvases and non-square aspect ratios match the main editor’s indexed color rules.
 */
"use client";

import { useMemo } from "react";

import type { ArtworkLayer } from "@/features/editor/types/editor.types";

import {
  LAYER_PREVIEW_MAX_EDGE_PX,
  previewImageClass,
  previewPlaceholderClass,
} from "@/features/editor/components/LayersDrawer/layersDrawer.constants";

interface LayerPreviewProps {
  layer: ArtworkLayer;
  palette: string[];
  width: number;
  height: number;
}

function rasterizeLayerToCanvas(
  layer: ArtworkLayer,
  palette: string[],
  width: number,
  height: number
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
      const paletteIndex = layer.pixelData[x + y * width];
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
  maxEdge: number
): HTMLCanvasElement {
  const scale = Math.min(maxEdge / artworkWidth, maxEdge / artworkHeight);
  const thumbW = Math.max(1, Math.round(artworkWidth * scale));
  const thumbH = Math.max(1, Math.round(artworkHeight * scale));

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

export function LayerPreview({
  layer,
  palette,
  width,
  height,
}: LayerPreviewProps) {
  const previewUrl = useMemo(() => {
    if (typeof document === "undefined") {
      return "";
    }
    const full = rasterizeLayerToCanvas(layer, palette, width, height);
    if (!full) {
      return "";
    }
    const thumb = downscaleCanvasNearest(full, width, height, LAYER_PREVIEW_MAX_EDGE_PX);
    try {
      return thumb.toDataURL("image/png");
    } catch {
      return "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps use pixelData buffer; often mutated in place (same ref)
  }, [layer.pixelData, palette, width, height]);

  if (!previewUrl) {
    return <div className={previewPlaceholderClass} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- data URL from canvas; not a static import
    <img src={previewUrl} alt="" className={previewImageClass} />
  );
}
