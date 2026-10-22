/**
 * Purpose:
 * One reorderable layer row: grip, preview, name, visibility, duplicate, and rename actions.
 */
"use client";

import Image from "next/image";

import { editor } from "@/content/editor";
import { PublicMaskIcon } from "@/features/shared/components/PublicMaskIcon";
import { cx } from "@/features/shared/utils/cx";

import { LayerPreview } from "@/features/editor/components/LayersDrawer/LayerPreview";
import { LAYER_ICON_SRC } from "@/features/editor/components/LayersDrawer/layersDrawer.constants";
import { sortableLayerItem } from "./SortableLayerItem.style";
import type { ISortableLayerItemProps } from "./SortableLayerItem.type";
import { useSortableLayerItem } from "./useSortableLayerItem";

export function SortableLayerItem(props: ISortableLayerItemProps) {
  const { layer, isActive, palette, width, height } = props;
  const {
    attributes,
    listeners,
    setNodeRef,
    style,
    previewKey,
    visibilityLabel,
    visibilityIcon,
    select,
    toggleVisibility,
    copy,
    rename,
  } = useSortableLayerItem(props);

  return (
    <li ref={setNodeRef} style={style} className={sortableLayerItem.wrap}>
      <div
        className={cx(
          sortableLayerItem.row,
          isActive ? sortableLayerItem.rowState.active : sortableLayerItem.rowState.idle,
        )}
      >
        <span
          className={sortableLayerItem.dragHandle}
          {...attributes}
          {...listeners}
          title={editor.layers.item.dragTitle}
        >
          <span className={sortableLayerItem.srOnly}>{editor.layers.item.reorder}</span>
          <Image
            src={LAYER_ICON_SRC.grip}
            alt=""
            width={20}
            height={20}
            className={sortableLayerItem.icon}
          />
        </span>
        <button
          type="button"
          className={sortableLayerItem.selectButton}
          onClick={select}
          aria-pressed={isActive}
        >
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
        </button>
        <div className={sortableLayerItem.actions}>
          <button
            type="button"
            className={sortableLayerItem.iconButton}
            onClick={toggleVisibility}
            title={visibilityLabel}
            aria-label={visibilityLabel}
          >
            <PublicMaskIcon src={visibilityIcon} className={sortableLayerItem.icon} />
          </button>
          <button
            type="button"
            className={sortableLayerItem.iconButton}
            onClick={copy}
            title={editor.layers.item.duplicate}
            aria-label={editor.layers.item.duplicate}
          >
            <Image
              src={LAYER_ICON_SRC.copy}
              alt=""
              width={20}
              height={20}
              className={sortableLayerItem.icon}
            />
          </button>
          <button
            type="button"
            className={sortableLayerItem.iconButton}
            onClick={rename}
            title={editor.layers.item.rename}
            aria-label={editor.layers.item.rename}
          >
            <Image
              src={LAYER_ICON_SRC.pencil}
              alt=""
              width={20}
              height={20}
              className={sortableLayerItem.icon}
            />
          </button>
        </div>
      </div>
    </li>
  );
}
