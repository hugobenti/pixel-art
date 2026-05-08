/**
 * Purpose:
 * One reorderable layer row: grip, preview, name, visibility and rename actions.
 */
"use client";

import { type KeyboardEvent } from "react";
import Image from "next/image";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { ArtworkLayer } from "@/features/editor/types/editor.types";

import { LayerPreview } from "@/features/editor/components/LayersDrawer/LayerPreview";
import {
  dragHandleClass,
  itemActiveClass,
  itemClass,
  itemIdleClass,
  LAYER_ICON_SRC,
  layerActionsClass,
  layerIconButtonClass,
  layerIconImgClass,
  layerNameClass,
  metadataClass,
  previewWrapClass,
} from "@/features/editor/components/LayersDrawer/layersDrawer.constants";

interface SortableLayerItemProps {
  layer: ArtworkLayer;
  isActive: boolean;
  palette: string[];
  width: number;
  height: number;
  onSelectLayer: (layerId: string) => void;
  onToggleVisibility: (layerId: string) => void;
  onRenameLayer: (layerId: string) => void;
  drawerOpen: boolean;
}

export function SortableLayerItem({
  layer,
  isActive,
  palette,
  width,
  height,
  onSelectLayer,
  onToggleVisibility,
  onRenameLayer,
  drawerOpen,
}: SortableLayerItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: layer.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.65 : 1,
  };
  const rowClass = `${itemClass} ${isActive ? itemActiveClass : itemIdleClass}`;

  const onRowKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelectLayer(layer.id);
    }
  };

  const visibilityIconSrc = layer.visible
    ? LAYER_ICON_SRC.eye
    : LAYER_ICON_SRC.eyeOff;

  return (
    <div ref={setNodeRef} style={style}>
      <div
        role="button"
        tabIndex={0}
        className={rowClass}
        onClick={() => onSelectLayer(layer.id)}
        onKeyDown={onRowKeyDown}
        aria-current={isActive ? "true" : undefined}
      >
        <span
          className={dragHandleClass}
          {...attributes}
          {...listeners}
          title="Drag to reorder (on touch: hold briefly, then drag)"
        >
          <span className="sr-only">Reorder layer</span>
          <Image
            src={LAYER_ICON_SRC.grip}
            alt=""
            width={20}
            height={20}
            className={layerIconImgClass}
          />
        </span>
        <span className={previewWrapClass}>
          <LayerPreview
            key={`${layer.id}-${drawerOpen ? "open" : "closed"}`}
            layer={layer}
            palette={palette}
            width={width}
            height={height}
          />
        </span>
        <span className={metadataClass}>
          <span className={layerNameClass}>{layer.name}</span>
        </span>
        <div className={layerActionsClass}>
          <button
            type="button"
            className={layerIconButtonClass}
            onClick={(event) => {
              event.stopPropagation();
              onToggleVisibility(layer.id);
            }}
            title={layer.visible ? "Hide layer" : "Show layer"}
            aria-label={layer.visible ? "Hide layer" : "Show layer"}
          >
            <Image
              src={visibilityIconSrc}
              alt=""
              width={20}
              height={20}
              className={layerIconImgClass}
            />
          </button>
          <button
            type="button"
            className={layerIconButtonClass}
            onClick={(event) => {
              event.stopPropagation();
              onRenameLayer(layer.id);
            }}
            title="Rename layer"
            aria-label="Rename layer"
          >
            <Image
              src={LAYER_ICON_SRC.pencil}
              alt=""
              width={20}
              height={20}
              className={layerIconImgClass}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
