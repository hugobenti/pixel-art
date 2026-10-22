/**
 * Purpose:
 * LayersDrawer behavior: panel motion (useLayersDrawerPanel), the rename dialog session, dnd-kit sensors
 * and reorder on drop, and Escape that closes the rename dialog first, then the drawer.
 */
"use client";

import { useEffect } from "react";

import {
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import { useLayerRenameDialog } from "@/features/editor/components/LayersDrawer/hooks/useLayerRenameDialog";
import { useLayersDrawerPanel } from "@/features/editor/components/LayersDrawer/useLayersDrawerPanel";
import type { ILayersDrawerProps } from "./LayersDrawer.type";

export function useLayersDrawer({
  layers,
  onClose,
  onRenameLayer,
  onReorderLayers,
}: ILayersDrawerProps) {
  const { panelEntered, handleClose } = useLayersDrawerPanel({ onClose });

  const layerRename = useLayerRenameDialog(onRenameLayer);
  const { session: renameSessionOpen, dismiss: dismissRename, requestRename } = layerRename;

  const handleRenameClick = (layerId: string) => {
    const layer = layers.find((l) => l.id === layerId);
    if (!layer) {
      return;
    }
    requestRename(layerId, layer.name);
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
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      // dnd-kit prevents the Escape that cancels a keyboard drag; that one must not close the drawer.
      if (event.key === "Escape" && !event.defaultPrevented) {
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
    layerIds: layers.map((layer) => layer.id),
    handleRenameClick,
    renameSession: layerRename.session,
    dismissRename,
    confirmRename: layerRename.confirm,
  };
}
