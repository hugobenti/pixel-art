/**
 * Purpose:
 * Sortable wiring, drag style, and row/action handlers for one layer row in the layers drawer.
 */
"use client";

import type { CSSProperties, KeyboardEvent, MouseEvent } from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface UseSortableLayerItemParams {
  layerId: string;
  drawerOpen: boolean;
  onSelectLayer: (layerId: string) => void;
  onToggleVisibility: (layerId: string) => void;
  onCopyLayer: (layerId: string) => void;
  onRenameClick: (layerId: string) => void;
}

export function useSortableLayerItem({
  layerId,
  drawerOpen,
  onSelectLayer,
  onToggleVisibility,
  onCopyLayer,
  onRenameClick,
}: UseSortableLayerItemParams) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: layerId,
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.65 : 1,
  };

  const onRowKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelectLayer(layerId);
    }
  };

  const onVisibilityClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onToggleVisibility(layerId);
  };

  const onCopyClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onCopyLayer(layerId);
  };

  const onRenameButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onRenameClick(layerId);
  };

  return {
    attributes,
    listeners,
    setNodeRef,
    style,
    /** Remounts the preview when the drawer opens/closes so the thumbnail re-rasterizes. */
    previewKey: `${layerId}-${drawerOpen ? "open" : "closed"}`,
    onRowKeyDown,
    onVisibilityClick,
    onCopyClick,
    onRenameButtonClick,
  };
}
