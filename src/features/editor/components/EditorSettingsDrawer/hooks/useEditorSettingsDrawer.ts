/**
 * Purpose:
 * View model for the editor settings SideDrawer: enter/exit motion, Escape-to-close (drill-ins go back first),
 * backdrop close wiring, drill-in navigation, and menu row values.
 */
"use client";

import { useCallback, useEffect } from "react";

import { useCanvasSizePanel } from "@/features/editor/components/EditorSettingsDrawer/hooks/useCanvasSizePanel";
import { useImportExportPanel } from "@/features/editor/components/EditorSettingsDrawer/hooks/useImportExportPanel";
import { useLayersDrawerPanel } from "@/features/editor/components/LayersDrawer/useLayersDrawerPanel";
import type { Artwork } from "@/features/shared/artwork/artwork.types";

interface UseEditorSettingsDrawerParams {
  artwork: Artwork;
  onApplyCanvasSize: (next: Artwork) => void;
  hasReferenceImage: boolean;
  onToggleReferenceImage: () => void;
  onClose: () => void;
}

export function useEditorSettingsDrawer({
  artwork,
  onApplyCanvasSize,
  hasReferenceImage,
  onToggleReferenceImage,
  onClose,
}: UseEditorSettingsDrawerParams) {
  const {
    settingsView,
    widthStr,
    heightStr,
    setWidthStr,
    setHeightStr,
    openCanvasSize,
    openImageDetail,
    openImportExport,
    backToMenu,
    applyCanvasSize,
  } = useCanvasSizePanel({ artwork, onApplyResized: onApplyCanvasSize });

  const { exportJson, exportPng } = useImportExportPanel({ artwork });

  const { panelEntered, handleClose } = useLayersDrawerPanel({ onClose });

  const isDrillIn =
    settingsView === "canvasSize" ||
    settingsView === "imageDetail" ||
    settingsView === "importExport";

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }
      if (isDrillIn) {
        backToMenu();
        return;
      }
      handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleClose, isDrillIn, backToMenu]);

  const toggleReferenceImage = useCallback(() => {
    if (!hasReferenceImage) {
      return;
    }
    onToggleReferenceImage();
  }, [hasReferenceImage, onToggleReferenceImage]);

  const handleExportPng = useCallback(() => {
    void exportPng();
  }, [exportPng]);

  return {
    panelEntered,
    handleClose,
    settingsView,
    isMenu: settingsView === "menu",
    isCanvasSize: settingsView === "canvasSize",
    isImageDetail: settingsView === "imageDetail",
    isImportExport: settingsView === "importExport",
    isDrillIn,
    sizeHint: `${artwork.width} × ${artwork.height}`,
    widthStr,
    heightStr,
    setWidthStr,
    setHeightStr,
    openCanvasSize,
    openImageDetail,
    openImportExport,
    backToMenu,
    applyCanvasSize,
    toggleReferenceImage,
    exportJson,
    handleExportPng,
  };
}
