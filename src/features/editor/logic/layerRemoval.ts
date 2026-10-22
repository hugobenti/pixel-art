/**
 * Purpose:
 * Remove one layer and pick the layer that stays active: unchanged when another layer is deleted,
 * otherwise the row that takes the deleted one's place (or the one above it at the end of the list).
 * An artwork always keeps at least one layer.
 */
import type { IArtworkLayer } from "@/features/shared/artwork/artwork.type";
import type { ILayerRemovalResult } from "./layerRemoval.type";

export function removeLayer(
  layers: readonly IArtworkLayer[],
  activeLayerId: string,
  layerId: string,
): ILayerRemovalResult | null {
  const index = layers.findIndex((layer) => layer.id === layerId);
  if (layers.length <= 1 || index < 0) {
    return null;
  }
  const nextLayers = layers.filter((layer) => layer.id !== layerId);
  const nextActiveId =
    activeLayerId === layerId
      ? nextLayers[Math.min(index, nextLayers.length - 1)].id
      : activeLayerId;
  return { layers: nextLayers, activeLayerId: nextActiveId };
}
