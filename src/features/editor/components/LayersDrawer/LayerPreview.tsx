/**
 * Purpose:
 * Small raster preview for a single artwork layer in the layers list.
 */
"use client";

import { useMemo } from "react";

import type { ArtworkLayer } from "@/features/editor/types/editor.types";

import { previewCanvasClass } from "@/features/editor/components/LayersDrawer/layersDrawer.constants";

interface LayerPreviewProps {
  layer: ArtworkLayer;
  palette: string[];
  width: number;
  height: number;
}

export function LayerPreview({
  layer,
  palette,
  width,
  height,
}: LayerPreviewProps) {
  const previewUrl = useMemo(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return "";
    }
    const size = 32;
    canvas.width = size;
    canvas.height = size;
    const scale = Math.max(1, Math.floor(Math.min(size / width, size / height)));
    const drawnW = width * scale;
    const drawnH = height * scale;
    const ox = Math.floor((size - drawnW) / 2);
    const oy = Math.floor((size - drawnH) / 2);

    ctx.clearRect(0, 0, size, size);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const paletteIndex = layer.pixelData[x + y * width];
        const color = palette[paletteIndex];
        if (!color) {
          continue;
        }
        ctx.fillStyle = color;
        ctx.fillRect(ox + x * scale, oy + y * scale, scale, scale);
      }
    }

    return canvas.toDataURL("image/png");
  }, [layer.pixelData, palette, width, height]);

  if (!previewUrl) {
    return <div className={previewCanvasClass} />;
  }

  return (
    <div
      className={previewCanvasClass}
      style={{
        backgroundImage: `url(${previewUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
  );
}
