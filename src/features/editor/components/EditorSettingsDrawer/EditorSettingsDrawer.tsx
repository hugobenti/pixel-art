/**
 * Purpose:
 * Right-side drawer with icon-led rows for grid, reference image, canvas size, image detail stats, and uploads.
 *
 * Notes:
 * Canvas size and image detail use in-drawer drill-in screens (no stacked modal). Reuses SideDrawer motion timing.
 */
"use client";

import { useCallback } from "react";

import { PublicMaskIcon } from "@/features/shared/components/PublicMaskIcon";
import {
  SideDrawer,
  SideDrawerBackButton,
  SideDrawerCloseButton,
} from "@/features/shared/components/SideDrawer";
import { PUBLIC_ICONS } from "@/features/shared/constants/publicIcons";

import { EditorSettingsCanvasSizePanel } from "@/features/editor/components/EditorSettingsDrawer/EditorSettingsCanvasSizePanel";
import { EditorSettingsImageDetailPanel } from "@/features/editor/components/EditorSettingsDrawer/EditorSettingsImageDetailPanel";
import { ANIMATION_MS } from "@/features/editor/components/LayersDrawer/layersDrawer.constants";
import { useCanvasSizePanel } from "@/features/editor/components/EditorSettingsDrawer/hooks/useCanvasSizePanel";
import { useEditorSettingsDrawer } from "@/features/editor/components/EditorSettingsDrawer/hooks/useEditorSettingsDrawer";

import type { Artwork, ViewportState } from "@/features/editor/types/editor.types";

interface EditorSettingsDrawerProps {
  artwork: Artwork;
  onApplyCanvasSize: (next: Artwork) => void;
  viewport: ViewportState;
  viewportCssWidth: number;
  viewportCssHeight: number;
  paintRevision: number;
  showPixelGrid: boolean;
  onToggleGrid: () => void;
  showReferenceImage: boolean;
  hasReferenceImage: boolean;
  onToggleReferenceImage: () => void;
  onLoadReferenceImage: () => void;
  onClose: () => void;
}

const menuRootClass = "min-h-0 flex-1 overflow-y-auto px-0 pb-3 pt-0 sm:pb-4";

const menuListClass = "flex flex-col divide-y divide-zinc-200 bg-white";

const menuRowClass = `
  flex min-h-12 w-full items-center justify-between gap-3 px-4 py-3
  text-left text-sm font-medium text-zinc-900 transition-colors
  active:bg-zinc-100 touch-manipulation
`;

const menuRowMutedClass = "cursor-not-allowed opacity-50 active:bg-transparent";

const menuHintClass = "shrink-0 text-xs font-normal text-zinc-500";

const rowLeadClass = "flex min-w-0 flex-1 items-center gap-3";

const menuIconClass = "h-6 w-6 text-zinc-600";

const shellBodyClass = "flex min-h-0 flex-1 flex-col overflow-hidden";

export function EditorSettingsDrawer({
  artwork,
  onApplyCanvasSize,
  viewport,
  viewportCssWidth,
  viewportCssHeight,
  paintRevision,
  showPixelGrid,
  onToggleGrid,
  showReferenceImage,
  hasReferenceImage,
  onToggleReferenceImage,
  onLoadReferenceImage,
  onClose,
}: EditorSettingsDrawerProps) {
  const {
    settingsView,
    widthStr,
    heightStr,
    setWidthStr,
    setHeightStr,
    openCanvasSize,
    openImageDetail,
    backToMenu,
    applyCanvasSize,
  } = useCanvasSizePanel({ artwork, onApplyResized: onApplyCanvasSize });

  const interceptEscape = useCallback(() => {
    if (settingsView === "canvasSize" || settingsView === "imageDetail") {
      backToMenu();
      return true;
    }
    return false;
  }, [settingsView, backToMenu]);

  const { panelEntered, handleClose } = useEditorSettingsDrawer({
    onClose,
    interceptEscape,
  });

  const gridLabel = showPixelGrid ? "Hide grid" : "Show grid";
  const imageLabel = showReferenceImage ? "Hide reference image" : "Show reference image";

  const drawerTitle =
    settingsView === "menu"
      ? "Settings"
      : settingsView === "canvasSize"
        ? "Canvas size"
        : "Image detail";

  const sizeHint = `${artwork.width} × ${artwork.height}`;

  const headerLeft =
    settingsView === "canvasSize" || settingsView === "imageDetail" ? (
      <SideDrawerBackButton onClick={backToMenu} aria-label="Back to settings" />
    ) : undefined;

  return (
    <SideDrawer
      entered={panelEntered}
      onBackdropClick={handleClose}
      title={drawerTitle}
      headerLeft={headerLeft}
      motionDurationMs={ANIMATION_MS}
      backdropAriaLabel="Close settings"
      headerRight={
        <SideDrawerCloseButton onClick={handleClose} aria-label="Close settings" />
      }
    >
      <div className={shellBodyClass}>
        {settingsView === "menu" ? (
          <div className={menuRootClass}>
            <nav className={menuListClass} aria-label="Editor settings">
              <button
                type="button"
                className={menuRowClass}
                onClick={() => {
                  onToggleGrid();
                }}
              >
                <span className={rowLeadClass}>
                  <PublicMaskIcon src={PUBLIC_ICONS.grid} className={menuIconClass} />
                  <span>Show / hide grid</span>
                </span>
                <span className={menuHintClass}>{gridLabel}</span>
              </button>
              <button
                type="button"
                className={`${menuRowClass} ${!hasReferenceImage ? menuRowMutedClass : ""}`}
                disabled={!hasReferenceImage}
                onClick={() => {
                  if (!hasReferenceImage) {
                    return;
                  }
                  onToggleReferenceImage();
                }}
              >
                <span className={rowLeadClass}>
                  <PublicMaskIcon src={PUBLIC_ICONS.eye} className={menuIconClass} />
                  <span>Show / hide image</span>
                </span>
                <span className={menuHintClass}>
                  {!hasReferenceImage ? "Load an image first" : imageLabel}
                </span>
              </button>
              <button
                type="button"
                className={menuRowClass}
                onClick={() => {
                  onLoadReferenceImage();
                }}
              >
                <span className={rowLeadClass}>
                  <PublicMaskIcon src={PUBLIC_ICONS.upload} className={menuIconClass} />
                  <span>Load image</span>
                </span>
                <span className={menuHintClass}>Pick file</span>
              </button>
              <button
                type="button"
                className={menuRowClass}
                onClick={() => {
                  openCanvasSize();
                }}
              >
                <span className={rowLeadClass}>
                  <PublicMaskIcon src={PUBLIC_ICONS.panArrows} className={menuIconClass} />
                  <span>Canvas size</span>
                </span>
                <span className={menuHintClass}>{sizeHint}</span>
              </button>
              <button
                type="button"
                className={menuRowClass}
                onClick={() => {
                  openImageDetail();
                }}
              >
                <span className={rowLeadClass}>
                  <PublicMaskIcon src={PUBLIC_ICONS.dashboard} className={menuIconClass} />
                  <span>Image detail</span>
                </span>
                <span className={menuHintClass}>Visible area</span>
              </button>
            </nav>
          </div>
        ) : settingsView === "canvasSize" ? (
          <EditorSettingsCanvasSizePanel
            widthStr={widthStr}
            heightStr={heightStr}
            onWidthChange={setWidthStr}
            onHeightChange={setHeightStr}
            onCancel={backToMenu}
            onApply={applyCanvasSize}
          />
        ) : (
          <EditorSettingsImageDetailPanel
            artwork={artwork}
            viewport={viewport}
            viewportCssWidth={viewportCssWidth}
            viewportCssHeight={viewportCssHeight}
            paintRevision={paintRevision}
          />
        )}
      </div>
    </SideDrawer>
  );
}
