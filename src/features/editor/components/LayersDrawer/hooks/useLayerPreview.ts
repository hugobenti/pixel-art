/**
 * Purpose:
 * Memoized PNG data URL thumbnail for one artwork layer in the layers list.
 *
 * Notes:
 * Keyed on the pixelData buffer; callers remount the preview (via `key`) to re-rasterize after in-place edits.
 */
"use client";

import { useMemo } from "react";

import { LAYER_PREVIEW_MAX_EDGE_PX } from "@/features/editor/components/LayersDrawer/layersDrawer.constants";
import { renderLayerPreviewDataUrl } from "@/features/editor/logic/layerPreviewRaster";
import type { ArtworkLayer } from "@/features/shared/artwork/artwork.types";

interface UseLayerPreviewParams {
  layer: ArtworkLayer;
  palette: string[];
  width: number;
  height: number;
}

export function useLayerPreview({ layer, palette, width, height }: UseLayerPreviewParams) {
  const { pixelData } = layer;
  const previewUrl = useMemo(
    () => renderLayerPreviewDataUrl(pixelData, palette, width, height, LAYER_PREVIEW_MAX_EDGE_PX),
    [pixelData, palette, width, height],
  );
  return { previewUrl };
}
