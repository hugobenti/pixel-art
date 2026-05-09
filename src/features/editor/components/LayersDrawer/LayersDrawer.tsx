/**
 * Purpose:
 * Right-side animated drawer to inspect, reorder, hide/show, and select artwork layers.
 *
 * Notes:
 * Shell uses shared SideDrawer; layer list/DnD stay here; timing in useLayersDrawerPanel.
 */
"use client";

import { useEffect } from "react";

import {
  closestCenter,
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { Button } from "@/features/shared/components/Button";
import { SideDrawer } from "@/features/shared/components/SideDrawer";

import {
  actionsRowClass,
  ANIMATION_MS,
  footerClass,
  listClass,
  listWrapClass,
} from "@/features/editor/components/LayersDrawer/layersDrawer.constants";
import { LayerRenameModal } from "@/features/editor/components/LayersDrawer/LayerRenameModal";
import { useLayerRenameDialog } from "@/features/editor/components/LayersDrawer/hooks/useLayerRenameDialog";
import { SortableLayerItem } from "@/features/editor/components/LayersDrawer/SortableLayerItem";
import { useLayersDrawerPanel } from "@/features/editor/components/LayersDrawer/useLayersDrawerPanel";

import type { ArtworkLayer } from "@/features/editor/types/editor.types";

interface LayersDrawerProps {
  layers: ArtworkLayer[];
  activeLayerId: string;
  palette: string[];
  width: number;
  height: number;
  onClose: () => void;
  onSelectLayer: (layerId: string) => void;
  onToggleVisibility: (layerId: string) => void;
  onAddLayer: () => void;
  onCopyLayer: (layerId: string) => void;
  onRenameLayer: (layerId: string, nextName: string) => void;
  onReorderLayers: (activeId: string, overId: string | null) => void;
}

export function LayersDrawer({
  layers,
  activeLayerId,
  palette,
  width,
  height,
  onClose,
  onSelectLayer,
  onToggleVisibility,
  onAddLayer,
  onCopyLayer,
  onRenameLayer,
  onReorderLayers,
}: LayersDrawerProps) {
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
    })
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

  return (
    <>
      <SideDrawer
        entered={panelEntered}
        onBackdropClick={handleClose}
        title="Layers"
        motionDurationMs={ANIMATION_MS}
        backdropAriaLabel="Close layers panel"
        headerRight={
          <Button
            type="button"
            variant="ghost"
            className="min-h-10 shrink-0 touch-manipulation px-3 sm:min-h-9 sm:px-2"
            onClick={handleClose}
          >
            Close
          </Button>
        }
        belowHeader={
          <div className={actionsRowClass}>
            <Button
              type="button"
              variant="primary"
              className="min-h-10 w-full touch-manipulation px-3 sm:min-h-9 sm:w-auto"
              onClick={onAddLayer}
            >
              Add layer
            </Button>
          </div>
        }
        footer={<footer className={footerClass}>Top items render in front of lower items.</footer>}
      >
        <div className={listWrapClass}>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={layers.map((layer) => layer.id)} strategy={verticalListSortingStrategy}>
              <div className={listClass}>
                {layers.map((layer) => (
                  <SortableLayerItem
                    key={layer.id}
                    layer={layer}
                    isActive={layer.id === activeLayerId}
                    palette={palette}
                    width={width}
                    height={height}
                    onSelectLayer={onSelectLayer}
                    onToggleVisibility={onToggleVisibility}
                    onCopyLayer={onCopyLayer}
                    onRenameClick={handleRenameClick}
                    drawerOpen={panelEntered}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </SideDrawer>

      <LayerRenameModal
        session={layerRename.session}
        onDismiss={layerRename.dismiss}
        onConfirm={layerRename.confirm}
      />
    </>
  );
}
