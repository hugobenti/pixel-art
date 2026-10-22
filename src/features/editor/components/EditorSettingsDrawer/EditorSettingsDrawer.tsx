/**
 * Purpose:
 * Right-side drawer with icon-led rows for grid, reference image, canvas size, image detail stats, and file transfer.
 *
 * Notes:
 * Canvas size, image detail, and import/export use in-drawer drill-in screens (no stacked modal).
 * Reuses SideDrawer motion timing.
 */
"use client";

import { editor } from "@/content/editor";
import { PublicMaskIcon } from "@/features/shared/components/PublicMaskIcon";
import {
  SideDrawer,
  SideDrawerBackButton,
  SideDrawerCloseButton,
} from "@/features/shared/components/SideDrawer";
import { ThemeToggle } from "@/features/shared/components/ThemeToggle";
import { PUBLIC_ICONS } from "@/features/shared/constants/publicIcons";
import { cx } from "@/features/shared/utils/cx";

import { EditorSettingsCanvasSizePanel } from "@/features/editor/components/EditorSettingsDrawer/EditorSettingsCanvasSizePanel";
import { EditorSettingsImageDetailPanel } from "@/features/editor/components/EditorSettingsDrawer/EditorSettingsImageDetailPanel";
import { EditorSettingsImportExportPanel } from "@/features/editor/components/EditorSettingsDrawer/EditorSettingsImportExportPanel";
import { ANIMATION_MS } from "@/features/editor/components/LayersDrawer/layersDrawer.constants";
import { useEditorSettingsDrawer } from "@/features/editor/components/EditorSettingsDrawer/hooks/useEditorSettingsDrawer";
import { editorSettingsDrawer } from "./EditorSettingsDrawer.style";
import type { IEditorSettingsDrawerProps } from "./EditorSettingsDrawer.type";

export function EditorSettingsDrawer(props: IEditorSettingsDrawerProps) {
  const {
    artwork,
    viewport,
    viewportCssWidth,
    viewportCssHeight,
    paintRevision,
    showPixelGrid,
    showReferenceImage,
    hasReferenceImage,
  } = props;
  const {
    settingsView,
    title,
    showBackButton,
    panelEntered,
    handleClose,
    backToMenu,
    gridHint,
    referenceHint,
    sizeHint,
    toggleGrid,
    toggleReferenceImage,
    loadReferenceImage,
    openCanvasSize,
    openImageDetail,
    openImportExport,
    widthStr,
    heightStr,
    setWidthStr,
    setHeightStr,
    applyCanvasSize,
    exportJson,
    exportPng,
  } = useEditorSettingsDrawer(props);
  const { menu } = editor.settings;

  return (
    <SideDrawer
      entered={panelEntered}
      onBackdropClick={handleClose}
      title={title}
      headerLeft={
        showBackButton ? (
          <SideDrawerBackButton
            // eslint-disable-next-line jsx-a11y/no-autofocus -- drill-in replaces the focused menu row; focus moves to the view's back control
            autoFocus
            onClick={backToMenu}
            aria-label={editor.settings.backLabel}
          />
        ) : undefined
      }
      motionDurationMs={ANIMATION_MS}
      backdropAriaLabel={editor.settings.closeLabel}
      headerRight={
        <SideDrawerCloseButton onClick={handleClose} aria-label={editor.settings.closeLabel} />
      }
    >
      <div className={editorSettingsDrawer.body}>
        {settingsView === "menu" ? (
          <div className={editorSettingsDrawer.menuRoot}>
            <div
              className={editorSettingsDrawer.menuList}
              role="group"
              aria-label={editor.settings.navLabel}
            >
              <button
                type="button"
                className={editorSettingsDrawer.menuRow}
                aria-pressed={showPixelGrid}
                onClick={toggleGrid}
              >
                <span className={editorSettingsDrawer.rowLead}>
                  <PublicMaskIcon
                    src={PUBLIC_ICONS.grid}
                    className={editorSettingsDrawer.menuIcon}
                  />
                  <span>{menu.grid.label}</span>
                </span>
                <span className={editorSettingsDrawer.menuHint}>{gridHint}</span>
              </button>
              <button
                type="button"
                className={cx(
                  editorSettingsDrawer.menuRow,
                  !hasReferenceImage && editorSettingsDrawer.menuRowMuted,
                )}
                disabled={!hasReferenceImage}
                aria-pressed={showReferenceImage}
                onClick={toggleReferenceImage}
              >
                <span className={editorSettingsDrawer.rowLead}>
                  <PublicMaskIcon
                    src={PUBLIC_ICONS.eye}
                    className={editorSettingsDrawer.menuIcon}
                  />
                  <span>{menu.referenceImage.label}</span>
                </span>
                <span className={editorSettingsDrawer.menuHint}>{referenceHint}</span>
              </button>
              <button
                type="button"
                className={editorSettingsDrawer.menuRow}
                onClick={loadReferenceImage}
              >
                <span className={editorSettingsDrawer.rowLead}>
                  <PublicMaskIcon
                    src={PUBLIC_ICONS.photo}
                    className={editorSettingsDrawer.menuIcon}
                  />
                  <span>{menu.loadImage.label}</span>
                </span>
                <span className={editorSettingsDrawer.menuHint}>{menu.loadImage.hint}</span>
              </button>
              <button
                type="button"
                className={editorSettingsDrawer.menuRow}
                onClick={openCanvasSize}
              >
                <span className={editorSettingsDrawer.rowLead}>
                  <PublicMaskIcon
                    src={PUBLIC_ICONS.resize}
                    className={editorSettingsDrawer.menuIcon}
                  />
                  <span>{menu.canvasSize.label}</span>
                </span>
                <span className={editorSettingsDrawer.menuHint}>{sizeHint}</span>
              </button>
              <button
                type="button"
                className={editorSettingsDrawer.menuRow}
                onClick={openImportExport}
              >
                <span className={editorSettingsDrawer.rowLead}>
                  <PublicMaskIcon
                    src={PUBLIC_ICONS.download}
                    className={editorSettingsDrawer.menuIcon}
                  />
                  <span>{menu.export.label}</span>
                </span>
                <span className={editorSettingsDrawer.menuHint}>{menu.export.hint}</span>
              </button>
              <button
                type="button"
                className={editorSettingsDrawer.menuRow}
                onClick={openImageDetail}
              >
                <span className={editorSettingsDrawer.rowLead}>
                  <PublicMaskIcon
                    src={PUBLIC_ICONS.dashboard}
                    className={editorSettingsDrawer.menuIcon}
                  />
                  <span>{menu.imageDetail.label}</span>
                </span>
                <span className={editorSettingsDrawer.menuHint}>{menu.imageDetail.hint}</span>
              </button>
              <ThemeToggle variant="row" />
            </div>
          </div>
        ) : null}
        {settingsView === "canvasSize" ? (
          <EditorSettingsCanvasSizePanel
            widthStr={widthStr}
            heightStr={heightStr}
            onWidthChange={setWidthStr}
            onHeightChange={setHeightStr}
            onCancel={backToMenu}
            onApply={applyCanvasSize}
          />
        ) : null}
        {settingsView === "imageDetail" ? (
          <EditorSettingsImageDetailPanel
            artwork={artwork}
            viewport={viewport}
            viewportCssWidth={viewportCssWidth}
            viewportCssHeight={viewportCssHeight}
            paintRevision={paintRevision}
          />
        ) : null}
        {settingsView === "importExport" ? (
          <EditorSettingsImportExportPanel onExportPng={exportPng} onExportJson={exportJson} />
        ) : null}
      </div>
    </SideDrawer>
  );
}
