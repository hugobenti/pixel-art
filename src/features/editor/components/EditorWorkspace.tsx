/**
 * Purpose:
 * Interactive pixel editor: viewport, layered canvases, painting, undo/redo, overlays, and autosave.
 *
 * Notes:
 * Pixel grid and symmetry-guide colors are defined on :root in globals.css (read by the canvas engine).
 * Contain-fit viewport uses normalizeViewportToPixelGrid so scale and offsets stay integer-aligned with wheel/pinch/pan.
 * Touch pointer tracking: useEditorPointerContacts runs before viewport navigation and pixel painting (see docs/canvas-pointer-contract.md).
 * Toolbar zoom logic lives in useToolbarCenterZoom + logic/toolbarCenterZoom.ts.
 */
"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { CanvasContainer } from "@/features/editor/components/CanvasContainer";
import { ColorSelectionRow } from "@/features/editor/components/ColorSelectionRow";
import { EditorActionsBar } from "@/features/editor/components/EditorActionsBar";
import { EditorSettingsDrawer } from "@/features/editor/components/EditorSettingsDrawer";
import { LayersDrawer } from "@/features/editor/components/LayersDrawer";
import { PaletteEditModal } from "@/features/editor/components/PaletteEditModal";
import { ShiftDirectionOverlay } from "@/features/editor/components/ShiftDirectionOverlay";
import { useArtworkLayers } from "@/features/editor/hooks/useArtworkLayers";
import { useCanvasEngine } from "@/features/editor/hooks/useCanvasEngine";
import { useEditorAutosave } from "@/features/editor/hooks/useEditorAutosave";
import { useEditorKeyboardShortcuts } from "@/features/editor/hooks/useEditorKeyboardShortcuts";
import { useEditorPalette } from "@/features/editor/hooks/useEditorPalette";
import { useEditorPointerContacts } from "@/features/editor/hooks/useEditorPointerContacts";
import { useHistory } from "@/features/editor/hooks/useHistory";
import { usePixelPainting } from "@/features/editor/hooks/usePixelPainting";
import { usePixelShift } from "@/features/editor/hooks/usePixelShift";
import { useReferenceImage } from "@/features/editor/hooks/useReferenceImage";
import { useToolbarCenterZoom } from "@/features/editor/hooks/useToolbarCenterZoom";
import {
  attachViewportPinchZoom,
  attachViewportWheel,
  useViewportNavigation,
} from "@/features/editor/hooks/useViewportNavigation";
import * as galleryService from "@/features/gallery/services/galleryService";

import { useToast } from "@/features/shared/components/Toast/hooks/useToast";

import type { Artwork } from "@/features/editor/types/editor.types";

import { EDITOR_TOAST_HIDDEN_LAYER_MESSAGE } from "@/features/editor/constants/editorToastMessages";
import { clampPaletteIndex } from "@/features/editor/logic/paletteMutations";
import {
  MAX_VIEWPORT_SCALE,
  normalizeViewportToPixelGrid,
} from "@/features/editor/logic/viewportPixelAlign";
import { computeContainFit } from "@/features/editor/logic/viewportFit";

const MIN_ZOOM_RATIO_OF_CONTAIN = 0.75;

const shellClass =
  "mx-auto flex h-[min(100dvh,100vh)] w-full max-w-6xl flex-col gap-2 px-4 py-4 min-h-0";

const chromeClass = "flex shrink-0 flex-col gap-0";

const mainClass = "flex min-h-0 flex-1 flex-col";

interface EditorWorkspaceProps {
  initialArtwork: Artwork;
}

export function EditorWorkspace({ initialArtwork }: EditorWorkspaceProps) {
  const { showToast } = useToast();
  const [artwork, setArtwork] = useState<Artwork>(initialArtwork);

  const [showPixelGrid, setShowPixelGrid] = useState(true);
  const [paintRevision, setPaintRevision] = useState(0);
  const [paletteModalOpen, setPaletteModalOpen] = useState(false);
  const [layersDrawerOpen, setLayersDrawerOpen] = useState(false);
  const [settingsDrawerOpen, setSettingsDrawerOpen] = useState(false);

  const artworkRef = useRef(artwork);
  useEffect(() => {
    artworkRef.current = artwork;
  }, [artwork]);

  const bumpPaintRaf = useRef<number | null>(null);
  const schedulePaintBump = useCallback(() => {
    if (bumpPaintRaf.current != null) {
      return;
    }
    bumpPaintRaf.current = window.requestAnimationFrame(() => {
      bumpPaintRaf.current = null;
      setPaintRevision((r) => r + 1);
    });
  }, []);

  const paletteUi = useEditorPalette({
    artwork,
    setArtwork,
    onPaletteOrPixelsDirty: schedulePaintBump,
  });

  const primaryPaint = clampPaletteIndex(
    paletteUi.primaryIndex,
    artwork.palette.length
  );
  const secondaryPaint = clampPaletteIndex(
    paletteUi.secondaryIndex,
    artwork.palette.length
  );

  const layersState = useArtworkLayers({
    artwork,
    setArtwork,
    onLayersChanged: schedulePaintBump,
  });

  const getLayerPixelData = useCallback(
    (layerId: string) =>
      artworkRef.current.layers.find((layer) => layer.id === layerId)?.pixelData ??
      null,
    []
  );

  const {
    pushCommand,
    undo,
    redo,
    canUndo,
    canRedo,
    historyRevision,
  } = useHistory({
    documentKey: `${artwork.id}:${artwork.width}x${artwork.height}`,
    getLayerPixelData,
  });

  const minScaleRef = useRef(1);
  const getMinScale = useCallback(() => minScaleRef.current, []);

  const { touchPointersRef } = useEditorPointerContacts();

  const {
    viewport,
    setViewport,
    handlers: zoomPanHandlers,
    panMode,
    setPanMode,
    deferPrimaryPaint,
  } = useViewportNavigation({ getMinScale, touchPointersRef });

  const referenceImage = useReferenceImage({
    initialReferenceImageDataUrl: artwork.referenceImageDataUrl,
    onReferenceImageChange: (dataUrl) => {
      setArtwork((prev) => ({ ...prev, referenceImageDataUrl: dataUrl }));
      schedulePaintBump();
    },
  });

  const {
    wrapRef,
    artworkCanvasRef,
    referenceImageCanvasRef,
    gridCanvasRef,
    cssSize,
  } = useCanvasEngine({
    artwork,
    viewport,
    showPixelGrid,
    showReferenceImage: referenceImage.showReferenceImage,
    referenceImage: referenceImage.referenceImageElement,
    referenceImageAlpha: referenceImage.referenceAlpha,
    paintRevision,
    historyRevision,
  });

  const viewportMinScaleUi = useMemo(
    () =>
      computeContainFit(cssSize.w, cssSize.h, artwork.width, artwork.height).scale *
      MIN_ZOOM_RATIO_OF_CONTAIN,
    [cssSize.w, cssSize.h, artwork.width, artwork.height]
  );

  const { onZoomIn, onZoomOut, canZoomIn, canZoomOut } = useToolbarCenterZoom({
    wrapRef,
    setViewport,
    minScaleRef,
    viewportMinScale: viewportMinScaleUi,
    viewportScale: viewport.scale,
  });

  useEditorAutosave({
    artworkRef,
    artworkId: artwork.id,
    paintRevision,
    historyRevision,
  });

  useEditorKeyboardShortcuts({
    onTogglePixelGrid: () => setShowPixelGrid((v) => !v),
    undo,
    redo,
  });

  useLayoutEffect(() => {
    const next = computeContainFit(
      cssSize.w,
      cssSize.h,
      artwork.width,
      artwork.height
    );
    const minScale = next.scale * MIN_ZOOM_RATIO_OF_CONTAIN;
    minScaleRef.current = minScale;
    setViewport(
      normalizeViewportToPixelGrid(next, {
        minScale,
        maxScale: MAX_VIEWPORT_SCALE,
      })
    );
  }, [cssSize.w, cssSize.h, artwork.width, artwork.height, setViewport]);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) {
      return;
    }
    const cleanupWheel = attachViewportWheel(el, setViewport, () =>
      minScaleRef.current
    );
    const cleanupPinch = attachViewportPinchZoom(el, setViewport, () =>
      minScaleRef.current
    );
    return () => {
      cleanupWheel();
      cleanupPinch();
    };
  }, [wrapRef, setViewport, cssSize.w, cssSize.h, artwork.width, artwork.height]);

  const onCommitStroke = useCallback(
    (cmd: import("@/features/editor/types/editor.types").HistoryCommand) => {
      pushCommand(cmd);
    },
    [pushCommand]
  );

  const handleApplyCanvasSize = useCallback((next: Artwork) => {
    setArtwork(next);
    schedulePaintBump();
  }, [schedulePaintBump]);

  const onHiddenActiveLayerPaintAttempt = useCallback(() => {
    showToast({
      message: EDITOR_TOAST_HIDDEN_LAYER_MESSAGE,
      tone: "error",
      skipDuplicateActiveToast: true,
    });
  }, [showToast]);

  const pixelShift = usePixelShift({
    pixelData: layersState.activeLayer?.pixelData ?? null,
    layerId: layersState.activeLayer?.id ?? null,
    width: artwork.width,
    height: artwork.height,
    pushCommand,
    schedulePaintBump,
  });

  const { onArtworkPointerDown } = usePixelPainting({
    artwork,
    activeLayerId: layersState.activeLayer?.id ?? null,
    activeLayerVisible: layersState.activeLayer?.visible ?? true,
    activeLayerPixelData: layersState.activeLayer?.pixelData ?? null,
    viewport,
    canvasRef: artworkCanvasRef,
    activeSlot: paletteUi.activeSlot,
    primaryPaletteIndex: primaryPaint,
    secondaryPaletteIndex: secondaryPaint,
    onCommitStroke,
    onPixelsChanged: schedulePaintBump,
    deferPrimaryPaint,
    touchPointersRef,
    onHiddenActiveLayerPaintAttempt,
  });

  return (
    <div className={shellClass}>
      <div className={chromeClass}>
        <ColorSelectionRow
          palette={artwork.palette}
          primaryIndex={primaryPaint}
          secondaryIndex={secondaryPaint}
          focusedSwatchIndex={paletteUi.focusedSwatchIndex}
          onSwatchPick={paletteUi.assignSwatchToActiveSlot}
          onOpenPaletteModal={() => setPaletteModalOpen(true)}
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
          onTogglePanMode={() => setPanMode((v) => !v)}
          canZoomOut={canZoomOut}
          canZoomIn={canZoomIn}
          onZoomOut={onZoomOut}
          onZoomIn={onZoomIn}
          shiftOverlayOpen={pixelShift.shiftOverlayOpen}
          onToggleShiftOverlay={pixelShift.toggleShiftOverlay}
          layersDrawerOpen={layersDrawerOpen}
          onToggleLayersDrawer={() => setLayersDrawerOpen((v) => !v)}
          settingsDrawerOpen={settingsDrawerOpen}
          onToggleSettingsDrawer={() => setSettingsDrawerOpen((v) => !v)}
        />
      </div>

      <PaletteEditModal
        open={paletteModalOpen}
        onClose={() => setPaletteModalOpen(false)}
        palette={artwork.palette}
        focusedSwatchIndex={paletteUi.focusedSwatchIndex}
        onSelectSwatch={paletteUi.selectSwatchForEditing}
        onApplyHex={paletteUi.applyHexAtIndex}
        onAddColor={paletteUi.addColor}
        onRemoveSwatch={paletteUi.removeSwatchAtIndex}
        canRemoveSwatch={artwork.palette.length > 1}
        maxPaletteReached={
          artwork.palette.length >= galleryService.MAX_PALETTE_ENTRIES
        }
      />

      <main className={mainClass}>
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
          onClose={() => setLayersDrawerOpen(false)}
          onSelectLayer={layersState.setActiveLayerId}
          onToggleVisibility={layersState.toggleLayerVisibility}
          onAddLayer={() => {
            layersState.addLayer();
          }}
          onCopyLayer={layersState.copyLayer}
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
          onToggleGrid={() => setShowPixelGrid((v) => !v)}
          showReferenceImage={referenceImage.showReferenceImage}
          hasReferenceImage={referenceImage.hasReferenceImage}
          onToggleReferenceImage={referenceImage.onToggleReferenceImage}
          onLoadReferenceImage={referenceImage.onLoadReferenceImage}
          onClose={() => setSettingsDrawerOpen(false)}
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
