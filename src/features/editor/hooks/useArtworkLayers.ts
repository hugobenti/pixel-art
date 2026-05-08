/**
 * Purpose:
 * Manage editor layer behavior (active layer selection, visibility toggles, ordering updates, and duplication).
 */
"use client";

import { useCallback, useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";

import type { Artwork, ArtworkLayer } from "@/features/editor/types/editor.types";
import { clonePixelBuffer } from "@/features/shared/utils/binaryHelpers";

interface UseArtworkLayersParams {
  artwork: Artwork;
  setArtwork: Dispatch<SetStateAction<Artwork>>;
  onLayersChanged: () => void;
}

function moveLayerByIds(layers: ArtworkLayer[], activeId: string, overId: string) {
  const from = layers.findIndex((layer) => layer.id === activeId);
  const to = layers.findIndex((layer) => layer.id === overId);
  if (from < 0 || to < 0 || from === to) {
    return layers;
  }

  const next = [...layers];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

const TRANSPARENT_SENTINEL_INDEX = 255;

export function useArtworkLayers({
  artwork,
  setArtwork,
  onLayersChanged,
}: UseArtworkLayersParams) {
  const layers = artwork.layers;

  const activeLayer = useMemo(
    () =>
      layers.find((layer) => layer.id === artwork.activeLayerId) ??
      layers[0] ??
      null,
    [layers, artwork.activeLayerId]
  );

  const visibleLayers = useMemo(
    () => layers.filter((layer) => layer.visible),
    [layers]
  );

  const setActiveLayerId = useCallback(
    (layerId: string) => {
      setArtwork((prev) => {
        if (prev.activeLayerId === layerId) {
          return prev;
        }
        if (!prev.layers.some((layer) => layer.id === layerId)) {
          return prev;
        }
        return { ...prev, activeLayerId: layerId };
      });
      onLayersChanged();
    },
    [setArtwork, onLayersChanged]
  );

  const toggleLayerVisibility = useCallback(
    (layerId: string) => {
      let didChange = false;
      setArtwork((prev) => {
        const nextLayers = prev.layers.map((layer) => {
          if (layer.id !== layerId) {
            return layer;
          }
          didChange = true;
          return { ...layer, visible: !layer.visible };
        });
        if (!didChange) {
          return prev;
        }
        return { ...prev, layers: nextLayers };
      });
      if (didChange) {
        onLayersChanged();
      }
    },
    [setArtwork, onLayersChanged]
  );

  const reorderLayers = useCallback(
    (activeId: string, overId: string | null) => {
      if (!overId || activeId === overId) {
        return;
      }
      let didChange = false;
      setArtwork((prev) => {
        const nextLayers = moveLayerByIds(prev.layers, activeId, overId);
        if (nextLayers === prev.layers) {
          return prev;
        }
        didChange = true;
        return { ...prev, layers: nextLayers };
      });
      if (didChange) {
        onLayersChanged();
      }
    },
    [setArtwork, onLayersChanged]
  );

  const addLayer = useCallback(() => {
    let createdLayerId = "";
    setArtwork((prev) => {
      const pixelCount = prev.width * prev.height;
      const nextLayer: ArtworkLayer = {
        id: crypto.randomUUID(),
        name: `Layer ${prev.layers.length + 1}`,
        visible: true,
        pixelData: new Uint8Array(pixelCount),
      };
      nextLayer.pixelData.fill(TRANSPARENT_SENTINEL_INDEX);
      createdLayerId = nextLayer.id;
      return {
        ...prev,
        layers: [...prev.layers, nextLayer],
        activeLayerId: nextLayer.id,
      };
    });
    onLayersChanged();
    return createdLayerId;
  }, [setArtwork, onLayersChanged]);

  const copyLayer = useCallback(
    (layerId: string) => {
      setArtwork((prev) => {
        const idx = prev.layers.findIndex((layer) => layer.id === layerId);
        if (idx < 0) {
          return prev;
        }
        const source = prev.layers[idx];
        const duplicated: ArtworkLayer = {
          id: crypto.randomUUID(),
          name: `${source.name} copy`,
          visible: source.visible,
          pixelData: clonePixelBuffer(source.pixelData),
        };
        const nextLayers = [...prev.layers];
        nextLayers.splice(idx, 0, duplicated);
        return {
          ...prev,
          layers: nextLayers,
          activeLayerId: duplicated.id,
        };
      });
      onLayersChanged();
    },
    [setArtwork, onLayersChanged]
  );

  const renameLayer = useCallback(
    (layerId: string, nextName: string) => {
      const trimmed = nextName.trim();
      if (!trimmed) {
        return;
      }
      let didChange = false;
      setArtwork((prev) => {
        const nextLayers = prev.layers.map((layer) => {
          if (layer.id !== layerId || layer.name === trimmed) {
            return layer;
          }
          didChange = true;
          return { ...layer, name: trimmed };
        });
        if (!didChange) {
          return prev;
        }
        return { ...prev, layers: nextLayers };
      });
      if (didChange) {
        onLayersChanged();
      }
    },
    [setArtwork, onLayersChanged]
  );

  const withUpdatedActiveLayerPixels = useCallback(
    (updater: (pixelData: Uint8Array, layerId: string) => boolean) => {
      const current = activeLayer;
      if (!current) {
        return false;
      }
      const nextPixels = clonePixelBuffer(current.pixelData);
      const changed = updater(nextPixels, current.id);
      if (!changed) {
        return false;
      }
      setArtwork((prev) => ({
        ...prev,
        layers: prev.layers.map((layer) =>
          layer.id === current.id ? { ...layer, pixelData: nextPixels } : layer
        ),
      }));
      return true;
    },
    [activeLayer, setArtwork]
  );

  return {
    layers,
    visibleLayers,
    activeLayer,
    setActiveLayerId,
    toggleLayerVisibility,
    reorderLayers,
    addLayer,
    copyLayer,
    renameLayer,
    withUpdatedActiveLayerPixels,
  };
}
