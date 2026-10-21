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
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { editor } from "@/content/editor";
import { Button } from "@/features/shared/components/Button";
import { SideDrawer, SideDrawerCloseButton } from "@/features/shared/components/SideDrawer";

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
import type { ILayersDrawerProps } from "./LayersDrawer.type";

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
}: ILayersDrawerProps) {
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
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
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

  return (
    <>
      <SideDrawer
        entered={panelEntered}
        onBackdropClick={handleClose}
        title={editor.layers.title}
        motionDurationMs={ANIMATION_MS}
        backdropAriaLabel={editor.layers.closeLabel}
        headerRight={
          <SideDrawerCloseButton onClick={handleClose} aria-label={editor.layers.closeLabel} />
        }
        belowHeader={
          <div className={actionsRowClass}>
            <Button
              type="button"
              variant="primary"
              className="min-h-10 w-full touch-manipulation px-3 sm:min-h-9 sm:w-auto"
              onClick={onAddLayer}
            >
              {editor.layers.add}
            </Button>
          </div>
        }
        footer={<footer className={footerClass}>{editor.layers.footer}</footer>}
      >
        <div className={listWrapClass}>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={layers.map((layer) => layer.id)} strategy={verticalListSortingStrategy}>
              <ul className={listClass}>
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
              </ul>
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
