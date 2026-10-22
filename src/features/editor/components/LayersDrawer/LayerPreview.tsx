/**
 * Purpose:
 * Small raster preview for a single artwork layer in the layers list.
 *
 * Notes:
 * useLayerPreview renders the layer at native resolution, then scales down nearest-neighbor so large
 * canvases and non-square aspect ratios match the main editor’s indexed color rules.
 */
"use client";

import { layerPreview } from "./LayerPreview.style";
import type { ILayerPreviewProps } from "./LayerPreview.type";
import { useLayerPreview } from "./useLayerPreview";

export function LayerPreview(props: ILayerPreviewProps) {
  const { previewUrl } = useLayerPreview(props);

  if (!previewUrl) {
    return <div className={layerPreview.placeholder} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- data URL from canvas; not a static import
    <img src={previewUrl} alt="" className={layerPreview.image} />
  );
}
