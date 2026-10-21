/**
 * Purpose:
 * View model for the layers drawer: panel motion, rename dialog, drag-and-drop sensors, and Escape handling.
 */
"use client";

import { useEffect } from "react";

import {
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";

import { useLayerRenameDialog } from "@/features/editor/components/LayersDrawer/hooks/useLayerRenameDialog";
import { useLayersDrawerPanel } from "@/features/editor/components/LayersDrawer/useLayersDrawerPanel";
import type { ArtworkLayer } from "@/features/shared/artwork/artwork.types";

interface UseLayersDrawerParams {
  layers: ArtworkLayer[];
  onClose: () => void;
  onRenameLayer: (layerId: string, nextName: string) => void;
  onReorderLayers: (activeId: string, overId: string | null) => void;
}

export function useLayersDrawer({
  layers,
  onClose,
  onRenameLayer,
  onReorderLayers,
}: UseLayersDrawerParams) {
  const { panelEntered, handleClose } = useLayersDrawerPanel({ onClose });

  const layerRename = useLayerRenameDialog(onRenameLayer);
  const { session: renameSessionOpen, dismiss: dismissRename } = layerRename;

  const handleRenameClick = (layerId: string) => {
    const layer = layers.find((l) => l.id === layerId);
    if (!layer) {
      return;
    }
    layerRename.requestRename(layerId, layer.name);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 6,
      },
    }),
  );

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        if (renameSessionOpen) {
          dismissRename();
          return;
        }
        handleClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleClose, renameSessionOpen, dismissRename]);

  const handleDragEnd = (event: DragEndEvent) => {
    if (!event.over) {
      return;
    }
    onReorderLayers(String(event.active.id), String(event.over.id));
  };

  return {
    panelEntered,
    handleClose,
    sensors,
    handleDragEnd,
    handleRenameClick,
    layerIds: layers.map((layer) => layer.id),
    renameSession: layerRename.session,
    dismissRename: layerRename.dismiss,
    confirmRename: layerRename.confirm,
  };
}
