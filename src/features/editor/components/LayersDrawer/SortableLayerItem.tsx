/**
 * Purpose:
 * One reorderable layer row: grip, preview, name, visibility, duplicate, and rename actions.
 */
"use client";

import Image from "next/image";

import type { ArtworkLayer } from "@/features/shared/artwork/artwork.types";

import { PublicMaskIcon } from "@/features/shared/components/PublicMaskIcon";
import { PUBLIC_ICONS } from "@/features/shared/constants/publicIcons";
import { cx } from "@/features/shared/utils/cx";

import { LayerPreview } from "@/features/editor/components/LayersDrawer/LayerPreview";
import { LAYER_ICON_SRC } from "@/features/editor/components/LayersDrawer/layersDrawer.constants";
import { sortableLayerItem } from "@/features/editor/components/LayersDrawer/SortableLayerItem.style";
import { useSortableLayerItem } from "@/features/editor/components/LayersDrawer/hooks/useSortableLayerItem";

interface SortableLayerItemProps {
  layer: ArtworkLayer;
  isActive: boolean;
  palette: string[];
  width: number;
  height: number;
  onSelectLayer: (layerId: string) => void;
  onToggleVisibility: (layerId: string) => void;
  onCopyLayer: (layerId: string) => void;
  onRenameClick: (layerId: string) => void;
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
  onCopyLayer,
  onRenameClick,
  drawerOpen,
}: SortableLayerItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    style,
    previewKey,
    onRowKeyDown,
    onVisibilityClick,
    onCopyClick,
    onRenameButtonClick,
  } = useSortableLayerItem({
    layerId: layer.id,
    drawerOpen,
    onSelectLayer,
    onToggleVisibility,
    onCopyLayer,
    onRenameClick,
  });

  return (
    <div ref={setNodeRef} style={style}>
      <div
        role="button"
        tabIndex={0}
        className={cx(
          sortableLayerItem.item,
          isActive ? sortableLayerItem.itemActive : sortableLayerItem.itemIdle
        )}
        onClick={() => onSelectLayer(layer.id)}
        onKeyDown={onRowKeyDown}
        aria-current={isActive ? "true" : undefined}
      >
        <span
          className={sortableLayerItem.dragHandle}
          {...attributes}
          {...listeners}
          title="Drag to reorder (on touch: hold briefly, then drag)"
        >
          <span className={sortableLayerItem.srOnly}>Reorder layer</span>
          <Image
            src={LAYER_ICON_SRC.grip}
            alt=""
            width={20}
            height={20}
            className={sortableLayerItem.layerIconImg}
          />
        </span>
        <span className={sortableLayerItem.previewWrap}>
          <LayerPreview
            key={previewKey}
            layer={layer}
            palette={palette}
            width={width}
            height={height}
          />
        </span>
        <span className={sortableLayerItem.metadata}>
          <span className={sortableLayerItem.layerName}>{layer.name}</span>
        </span>
        <div className={sortableLayerItem.layerActions}>
          <button
            type="button"
            className={sortableLayerItem.layerIconButton}
            onClick={onVisibilityClick}
            title={layer.visible ? "Hide layer" : "Show layer"}
            aria-label={layer.visible ? "Hide layer" : "Show layer"}
          >
            <PublicMaskIcon
              src={layer.visible ? PUBLIC_ICONS.eye : PUBLIC_ICONS.eyeOff}
              className={sortableLayerItem.layerIconImg}
            />
          </button>
          <button
            type="button"
            className={sortableLayerItem.layerIconButton}
            onClick={onCopyClick}
            title="Duplicate layer"
            aria-label="Duplicate layer"
          >
            <Image
              src={LAYER_ICON_SRC.copy}
              alt=""
              width={20}
              height={20}
              className={sortableLayerItem.layerIconImg}
            />
          </button>
          <button
            type="button"
            className={sortableLayerItem.layerIconButton}
            onClick={onRenameButtonClick}
            title="Rename layer"
            aria-label="Rename layer"
          >
            <Image
              src={LAYER_ICON_SRC.pencil}
              alt=""
              width={20}
              height={20}
              className={sortableLayerItem.layerIconImg}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
