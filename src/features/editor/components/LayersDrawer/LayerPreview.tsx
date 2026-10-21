/**
 * Purpose:
 * Small raster preview for a single artwork layer in the layers list.
 *
 * Notes:
 * Rasterization lives in logic/layerPreviewRaster (nearest-neighbor downscale, indexed color rules).
 */
"use client";

import type { ArtworkLayer } from "@/features/shared/artwork/artwork.types";

import { layerPreview } from "@/features/editor/components/LayersDrawer/LayerPreview.style";
import { useLayerPreview } from "@/features/editor/components/LayersDrawer/hooks/useLayerPreview";

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
  const { previewUrl } = useLayerPreview({ layer, palette, width, height });

  if (!previewUrl) {
    return <div className={layerPreview.placeholder} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- data URL from canvas; not a static import
    <img src={previewUrl} alt="" className={layerPreview.image} />
  );
}
