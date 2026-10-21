/**
 * Purpose:
 * Right-side drawer with icon-led rows for grid, reference image, canvas size, image detail stats, and file transfer.
 *
 * Notes:
 * Canvas size, image detail, and import/export use in-drawer drill-in screens (no stacked modal).
 * Reuses SideDrawer motion timing.
 */
"use client";

import { PublicMaskIcon } from "@/features/shared/components/PublicMaskIcon";
import {
  SideDrawer,
  SideDrawerBackButton,
  SideDrawerCloseButton,
} from "@/features/shared/components/SideDrawer";
import { PUBLIC_ICONS } from "@/features/shared/constants/publicIcons";
import { cx } from "@/features/shared/utils/cx";

import { EditorSettingsCanvasSizePanel } from "@/features/editor/components/EditorSettingsDrawer/EditorSettingsCanvasSizePanel";
import { EDITOR_SETTINGS_TITLES } from "@/features/editor/components/EditorSettingsDrawer/EditorSettingsDrawer.data";
import { editorSettingsDrawer } from "@/features/editor/components/EditorSettingsDrawer/EditorSettingsDrawer.style";
import { EditorSettingsImageDetailPanel } from "@/features/editor/components/EditorSettingsDrawer/EditorSettingsImageDetailPanel";
import { EditorSettingsImportExportPanel } from "@/features/editor/components/EditorSettingsDrawer/EditorSettingsImportExportPanel";
import { ANIMATION_MS } from "@/features/editor/components/LayersDrawer/layersDrawer.constants";
import { useEditorSettingsDrawer } from "@/features/editor/components/EditorSettingsDrawer/hooks/useEditorSettingsDrawer";

import type { Artwork } from "@/features/shared/artwork/artwork.types";
import type { ViewportState } from "@/features/editor/types/editor.types";

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
    panelEntered,
    handleClose,
    settingsView,
    isMenu,
    isCanvasSize,
    isImageDetail,
    isImportExport,
    isDrillIn,
    sizeHint,
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
  } = useEditorSettingsDrawer({
    artwork,
    onApplyCanvasSize,
    hasReferenceImage,
    onToggleReferenceImage,
    onClose,
  });

  return (
    <SideDrawer
      entered={panelEntered}
      onBackdropClick={handleClose}
      title={EDITOR_SETTINGS_TITLES[settingsView]}
      headerLeft={
        isDrillIn ? (
          <SideDrawerBackButton onClick={backToMenu} aria-label="Back to settings" />
        ) : undefined
      }
      motionDurationMs={ANIMATION_MS}
      backdropAriaLabel="Close settings"
      headerRight={
        <SideDrawerCloseButton onClick={handleClose} aria-label="Close settings" />
      }
    >
      <div className={editorSettingsDrawer.shellBody}>
        {isMenu && (
          <div className={editorSettingsDrawer.menuRoot}>
            <nav className={editorSettingsDrawer.menuList} aria-label="Editor settings">
              <button
                type="button"
                className={editorSettingsDrawer.menuRow}
                onClick={() => {
                  onToggleGrid();
                }}
              >
                <span className={editorSettingsDrawer.rowLead}>
                  <PublicMaskIcon src={PUBLIC_ICONS.grid} className={editorSettingsDrawer.menuIcon} />
                  <span>Show / hide grid</span>
                </span>
                <span className={editorSettingsDrawer.menuHint}>{showPixelGrid ? "Hide grid" : "Show grid"}</span>
              </button>
              <button
                type="button"
                className={cx(editorSettingsDrawer.menuRow, !hasReferenceImage && editorSettingsDrawer.menuRowMuted)}
                disabled={!hasReferenceImage}
                onClick={toggleReferenceImage}
              >
                <span className={editorSettingsDrawer.rowLead}>
                  <PublicMaskIcon src={PUBLIC_ICONS.eye} className={editorSettingsDrawer.menuIcon} />
                  <span>Show / hide image</span>
                </span>
                <span className={editorSettingsDrawer.menuHint}>
                  {!hasReferenceImage && "Load an image first"}
                  {hasReferenceImage &&
                    (showReferenceImage ? "Hide reference image" : "Show reference image")}
                </span>
              </button>
              <button
                type="button"
                className={editorSettingsDrawer.menuRow}
                onClick={() => {
                  onLoadReferenceImage();
                }}
              >
                <span className={editorSettingsDrawer.rowLead}>
                  <PublicMaskIcon src={PUBLIC_ICONS.upload} className={editorSettingsDrawer.menuIcon} />
                  <span>Load image</span>
                </span>
                <span className={editorSettingsDrawer.menuHint}>Pick file</span>
              </button>
              <button
                type="button"
                className={editorSettingsDrawer.menuRow}
                onClick={() => {
                  openCanvasSize();
                }}
              >
                <span className={editorSettingsDrawer.rowLead}>
                  <PublicMaskIcon src={PUBLIC_ICONS.panArrows} className={editorSettingsDrawer.menuIcon} />
                  <span>Canvas size</span>
                </span>
                <span className={editorSettingsDrawer.menuHint}>{sizeHint}</span>
              </button>
              <button
                type="button"
                className={editorSettingsDrawer.menuRow}
                onClick={() => {
                  openImportExport();
                }}
              >
                <span className={editorSettingsDrawer.rowLead}>
                  <PublicMaskIcon src={PUBLIC_ICONS.upload} className={editorSettingsDrawer.menuIcon} />
                  <span>Export</span>
                </span>
                <span className={editorSettingsDrawer.menuHint}>Download files</span>
              </button>
              <button
                type="button"
                className={editorSettingsDrawer.menuRow}
                onClick={() => {
                  openImageDetail();
                }}
              >
                <span className={editorSettingsDrawer.rowLead}>
                  <PublicMaskIcon src={PUBLIC_ICONS.dashboard} className={editorSettingsDrawer.menuIcon} />
                  <span>Image detail</span>
                </span>
                <span className={editorSettingsDrawer.menuHint}>Visible area</span>
              </button>
            </nav>
          </div>
        )}
        {isCanvasSize && (
          <EditorSettingsCanvasSizePanel
            widthStr={widthStr}
            heightStr={heightStr}
            onWidthChange={setWidthStr}
            onHeightChange={setHeightStr}
            onCancel={backToMenu}
            onApply={applyCanvasSize}
          />
        )}
        {isImageDetail && (
          <EditorSettingsImageDetailPanel
            artwork={artwork}
            viewport={viewport}
            viewportCssWidth={viewportCssWidth}
            viewportCssHeight={viewportCssHeight}
            paintRevision={paintRevision}
          />
        )}
        {isImportExport && (
          <EditorSettingsImportExportPanel
            onExportPng={handleExportPng}
            onExportJson={exportJson}
          />
        )}
      </div>
    </SideDrawer>
  );
}
