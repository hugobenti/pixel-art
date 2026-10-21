/**
 * Purpose:
 * Right-side animated drawer to inspect, reorder, hide/show, and select artwork layers.
 *
 * Notes:
 * Shell uses shared SideDrawer; layer list/DnD stay here; timing in useLayersDrawerPanel.
 */
"use client";

import { closestCenter, DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { Button } from "@/features/shared/components/Button";
import { SideDrawer, SideDrawerCloseButton } from "@/features/shared/components/SideDrawer";

import { ANIMATION_MS } from "@/features/editor/components/LayersDrawer/layersDrawer.constants";
import { layersDrawer } from "@/features/editor/components/LayersDrawer/LayersDrawer.style";
import { LayerRenameModal } from "@/features/editor/components/LayersDrawer/LayerRenameModal";
import { useLayersDrawer } from "@/features/editor/components/LayersDrawer/hooks/useLayersDrawer";
import { SortableLayerItem } from "@/features/editor/components/LayersDrawer/SortableLayerItem";

import type { ArtworkLayer } from "@/features/shared/artwork/artwork.types";

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
  const {
    panelEntered,
    handleClose,
    sensors,
    handleDragEnd,
    handleRenameClick,
    layerIds,
    renameSession,
    dismissRename,
    confirmRename,
  } = useLayersDrawer({ layers, onClose, onRenameLayer, onReorderLayers });

  return (
    <>
      <SideDrawer
        entered={panelEntered}
        onBackdropClick={handleClose}
        title="Layers"
        motionDurationMs={ANIMATION_MS}
        backdropAriaLabel="Close layers panel"
        headerRight={
          <SideDrawerCloseButton onClick={handleClose} aria-label="Close layers panel" />
        }
        belowHeader={
          <div className={layersDrawer.actionsRow}>
            <Button
              type="button"
              variant="primary"
              className={layersDrawer.addLayerButton}
              onClick={onAddLayer}
            >
              Add layer
            </Button>
          </div>
        }
        footer={
          <footer className={layersDrawer.footer}>Top items render in front of lower items.</footer>
        }
      >
        <div className={layersDrawer.listWrap}>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={layerIds} strategy={verticalListSortingStrategy}>
              <div className={layersDrawer.list}>
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
        session={renameSession}
        onDismiss={dismissRename}
        onConfirm={confirmRename}
      />
    </>
  );
}
