/**
 * Purpose:
 * Interactive pixel editor: viewport, layered canvases, painting, undo/redo, overlays, and autosave.
 *
 * Notes:
 * useEditorWorkspace composes the editor hooks; this file only lays out toolbar, palette modal,
 * canvas, drawers and shift overlay.
 */
"use client";

import { CanvasContainer } from "@/features/editor/components/CanvasContainer";
import { ColorSelectionRow } from "@/features/editor/components/ColorSelectionRow";
import { EditorActionsBar } from "@/features/editor/components/EditorActionsBar";
import { EditorSettingsDrawer } from "@/features/editor/components/EditorSettingsDrawer";
import { LayersDrawer } from "@/features/editor/components/LayersDrawer";
import { PaletteEditModal } from "@/features/editor/components/PaletteEditModal";
import { ShiftDirectionOverlay } from "@/features/editor/components/ShiftDirectionOverlay";
import { editorWorkspace } from "./EditorWorkspace.style";
import type { IEditorWorkspaceProps } from "./EditorWorkspace.type";
import { useEditorWorkspace } from "./useEditorWorkspace";

export function EditorWorkspace(props: IEditorWorkspaceProps) {
  const {
    artwork,
    paletteUi,
    primaryPaint,
    secondaryPaint,
    canUndo,
    canRedo,
    undo,
    redo,
    panMode,
    togglePanMode,
    bucketMode,
    toggleBucketMode,
    canZoomIn,
    canZoomOut,
    onZoomIn,
    onZoomOut,
    pixelShift,
    paletteModalOpen,
    openPaletteModal,
    closePaletteModal,
    canRemoveSwatch,
    maxPaletteReached,
    wrapRef,
    artworkCanvasRef,
    referenceImageCanvasRef,
    gridCanvasRef,
    zoomPanHandlers,
    onArtworkPointerDown,
    layersState,
    layersDrawerOpen,
    toggleLayersDrawer,
    closeLayersDrawer,
    addLayer,
    settingsDrawerOpen,
    toggleSettingsDrawer,
    closeSettingsDrawer,
    handleApplyCanvasSize,
    viewport,
    cssSize,
    paintRevision,
    showPixelGrid,
    togglePixelGrid,
    referenceImage,
  } = useEditorWorkspace(props);

  return (
    <div className={editorWorkspace.shell}>
      <header className={editorWorkspace.chrome}>
        <ColorSelectionRow
          palette={artwork.palette}
          primaryIndex={primaryPaint}
          secondaryIndex={secondaryPaint}
          focusedSwatchIndex={paletteUi.focusedSwatchIndex}
          onSwatchPick={paletteUi.assignSwatchToActiveSlot}
          onOpenPaletteModal={openPaletteModal}
        />
        <EditorActionsBar
          title={artwork.title}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={undo}
          onRedo={redo}
          activeSlot={paletteUi.activeSlot}
          onToggleActiveSlot={paletteUi.toggleActiveSlot}
          panMode={panMode}
          onTogglePanMode={togglePanMode}
          bucketMode={bucketMode}
          onToggleBucketMode={toggleBucketMode}
          canZoomOut={canZoomOut}
          canZoomIn={canZoomIn}
          onZoomOut={onZoomOut}
          onZoomIn={onZoomIn}
          shiftOverlayOpen={pixelShift.shiftOverlayOpen}
          onToggleShiftOverlay={pixelShift.toggleShiftOverlay}
          layersDrawerOpen={layersDrawerOpen}
          onToggleLayersDrawer={toggleLayersDrawer}
          settingsDrawerOpen={settingsDrawerOpen}
          onToggleSettingsDrawer={toggleSettingsDrawer}
        />
      </header>

      <PaletteEditModal
        open={paletteModalOpen}
        onClose={closePaletteModal}
        palette={artwork.palette}
        focusedSwatchIndex={paletteUi.focusedSwatchIndex}
        onSelectSwatch={paletteUi.selectSwatchForEditing}
        onApplyHex={paletteUi.applyHexAtIndex}
        onAddColor={paletteUi.addColor}
        onRemoveSwatch={paletteUi.removeSwatchAtIndex}
        canRemoveSwatch={canRemoveSwatch}
        maxPaletteReached={maxPaletteReached}
      />

      <main className={editorWorkspace.main}>
        <CanvasContainer
          wrapRef={wrapRef}
          artworkCanvasRef={artworkCanvasRef}
          referenceImageCanvasRef={referenceImageCanvasRef}
          gridCanvasRef={gridCanvasRef}
          viewportHandlers={zoomPanHandlers}
          onArtworkPointerDown={onArtworkPointerDown}
        />
      </main>

      {layersDrawerOpen ? (
        <LayersDrawer
          layers={artwork.layers}
          activeLayerId={artwork.activeLayerId}
          palette={artwork.palette}
          width={artwork.width}
          height={artwork.height}
          onClose={closeLayersDrawer}
          onSelectLayer={layersState.setActiveLayerId}
          onToggleVisibility={layersState.toggleLayerVisibility}
          onAddLayer={addLayer}
          onCopyLayer={layersState.copyLayer}
          onDeleteLayer={layersState.deleteLayer}
          onRenameLayer={layersState.renameLayer}
          onReorderLayers={layersState.reorderLayers}
        />
      ) : null}

      {settingsDrawerOpen ? (
        <EditorSettingsDrawer
          artwork={artwork}
          onApplyCanvasSize={handleApplyCanvasSize}
          viewport={viewport}
          viewportCssWidth={cssSize.w}
          viewportCssHeight={cssSize.h}
          paintRevision={paintRevision}
          showPixelGrid={showPixelGrid}
          onToggleGrid={togglePixelGrid}
          showReferenceImage={referenceImage.showReferenceImage}
          hasReferenceImage={referenceImage.hasReferenceImage}
          onToggleReferenceImage={referenceImage.onToggleReferenceImage}
          onLoadReferenceImage={referenceImage.onLoadReferenceImage}
          onClose={closeSettingsDrawer}
        />
      ) : null}

      <ShiftDirectionOverlay
        open={pixelShift.shiftOverlayOpen}
        onClose={pixelShift.closeShiftOverlay}
        onShift={pixelShift.applyShift}
      />
    </div>
  );
}
