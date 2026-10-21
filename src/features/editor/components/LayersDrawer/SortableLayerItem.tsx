/**
 * Purpose:
 * One reorderable layer row: grip, preview, name, visibility, duplicate, and rename actions.
 */
"use client";

import Image from "next/image";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { editor } from "@/content/editor";
import { PublicMaskIcon } from "@/features/shared/components/PublicMaskIcon";
import { PUBLIC_ICONS } from "@/features/shared/constants/publicIcons";

import { LayerPreview } from "@/features/editor/components/LayersDrawer/LayerPreview";
import {
  dragHandleClass,
  itemActiveClass,
  itemClass,
  itemIdleClass,
  itemWrapClass,
  LAYER_ICON_SRC,
  layerActionsClass,
  layerIconButtonClass,
  layerIconImgClass,
  layerNameClass,
  metadataClass,
  previewWrapClass,
  selectButtonClass,
} from "@/features/editor/components/LayersDrawer/layersDrawer.constants";
import type { ISortableLayerItemProps } from "./SortableLayerItem.type";

export function SortableLayerItem({
  layer,
  isActive,
  palette,
  width,
  height,
  onSelectLayer,
  onToggleVisibility,
  onCopyLayer,
  onRenameClick,
  drawerOpen,
}: ISortableLayerItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: layer.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.65 : 1,
  };
  const rowClass = `${itemClass} ${isActive ? itemActiveClass : itemIdleClass}`;

  return (
    <li ref={setNodeRef} style={style} className={itemWrapClass}>
      <div className={rowClass}>
        <span
          className={dragHandleClass}
          {...attributes}
          {...listeners}
          title={editor.layers.item.dragTitle}
        >
          <span className="sr-only">{editor.layers.item.reorder}</span>
          <Image
            src={LAYER_ICON_SRC.grip}
            alt=""
            width={20}
            height={20}
            className={layerIconImgClass}
          />
        </span>
        <button
          type="button"
          className={selectButtonClass}
          onClick={() => onSelectLayer(layer.id)}
          aria-pressed={isActive}
        >
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
        </button>
        <div className={layerActionsClass}>
          <button
            type="button"
            className={layerIconButtonClass}
            onClick={(event) => {
              event.stopPropagation();
              onToggleVisibility(layer.id);
            }}
            title={layer.visible ? editor.layers.item.hide : editor.layers.item.show}
            aria-label={layer.visible ? editor.layers.item.hide : editor.layers.item.show}
          >
            <PublicMaskIcon
              src={layer.visible ? PUBLIC_ICONS.eye : PUBLIC_ICONS.eyeOff}
              className={layerIconImgClass}
            />
          </button>
          <button
            type="button"
            className={layerIconButtonClass}
            onClick={(event) => {
              event.stopPropagation();
              onCopyLayer(layer.id);
            }}
            title={editor.layers.item.duplicate}
            aria-label={editor.layers.item.duplicate}
          >
            <Image
              src={LAYER_ICON_SRC.copy}
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
              onRenameClick(layer.id);
            }}
            title={editor.layers.item.rename}
            aria-label={editor.layers.item.rename}
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
    </li>
  );
}
