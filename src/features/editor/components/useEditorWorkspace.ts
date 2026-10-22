/**
 * Purpose:
 * EditorWorkspace view model: the editable artwork, panel open state, and the editor hooks composed
 * into what the toolbar, palette modal, canvas, drawers and shift overlay render.
 *
 * Notes:
 * Pixel grid and symmetry-guide colors are defined on :root in globals.css (read by the canvas engine).
 * Contain-fit viewport (useContainFitViewport) uses normalizeViewportToPixelGrid so scale and offsets stay integer-aligned with wheel/pinch/pan.
 * Touch pointer tracking: useEditorPointerContacts runs before viewport navigation and pixel painting (see docs/canvas-pointer-contract.md).
 * Toolbar zoom logic lives in useToolbarCenterZoom + logic/toolbarCenterZoom.ts.
 */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { editor } from "@/content/editor";
import { useArtworkLayers } from "@/features/editor/hooks/useArtworkLayers";
import { useCanvasEngine } from "@/features/editor/hooks/useCanvasEngine";
import { useContainFitViewport } from "@/features/editor/hooks/useContainFitViewport";
import { useEditorAutosave } from "@/features/editor/hooks/useEditorAutosave";
import { useEditorKeyboardShortcuts } from "@/features/editor/hooks/useEditorKeyboardShortcuts";
import { useEditorPalette } from "@/features/editor/hooks/useEditorPalette";
import { useEditorPointerContacts } from "@/features/editor/hooks/useEditorPointerContacts";
import { useHistory } from "@/features/editor/hooks/useHistory";
import { usePixelPainting } from "@/features/editor/hooks/usePixelPainting";
import { usePixelShift } from "@/features/editor/hooks/usePixelShift";
import { useReferenceImage } from "@/features/editor/hooks/useReferenceImage";
import { useToolbarCenterZoom } from "@/features/editor/hooks/useToolbarCenterZoom";
import { useViewportKeyboardPan } from "@/features/editor/hooks/useViewportKeyboardPan";
import { useViewportNavigation } from "@/features/editor/hooks/useViewportNavigation";
import { useViewportWheelAndPinch } from "@/features/editor/hooks/useViewportWheelAndPinch";
import { clampPaletteIndex } from "@/features/editor/logic/paletteMutations";
import type { IHistoryCommand } from "@/features/editor/types/editor.type";
import type { IArtwork } from "@/features/shared/artwork/artwork.type";
import * as artworkService from "@/features/shared/artwork/artworkService";
import { useToast } from "@/features/shared/components/Toast/hooks/useToast";
import type { IEditorWorkspaceProps } from "./EditorWorkspace.type";

export function useEditorWorkspace({ initialArtwork }: IEditorWorkspaceProps) {
  const { showToast } = useToast();
  const [artwork, setArtwork] = useState<IArtwork>(initialArtwork);

  const [showPixelGrid, setShowPixelGrid] = useState(true);
  const [paintRevision, setPaintRevision] = useState(0);
  const [paletteModalOpen, setPaletteModalOpen] = useState(false);
  const [layersDrawerOpen, setLayersDrawerOpen] = useState(false);
  const [settingsDrawerOpen, setSettingsDrawerOpen] = useState(false);
  const [bucketMode, setBucketMode] = useState(false);

  const artworkRef = useRef(artwork);
  useEffect(() => {
    artworkRef.current = artwork;
  }, [artwork]);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = editor.screen.documentTitle(artwork.title);
    return () => {
      document.title = previousTitle;
    };
  }, [artwork.title]);

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

  const getLayers = useCallback(() => artworkRef.current.layers, []);

  const { pushCommand, undo, undoCommand, redo, canUndo, canRedo, historyRevision } = useHistory({
    documentKey: `${artwork.id}:${artwork.width}x${artwork.height}`,
    getLayers,
  });

  const paletteUi = useEditorPalette({
    artwork,
    setArtwork,
    onPaletteOrPixelsDirty: schedulePaintBump,
    pushCommand,
    undoCommand,
  });

  const primaryPaint = clampPaletteIndex(paletteUi.primaryIndex, artwork.palette.length);
  const secondaryPaint = clampPaletteIndex(paletteUi.secondaryIndex, artwork.palette.length);

  const layersState = useArtworkLayers({
    artwork,
    setArtwork,
    onLayersChanged: schedulePaintBump,
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

  const { wrapRef, artworkCanvasRef, referenceImageCanvasRef, gridCanvasRef, cssSize } =
    useCanvasEngine({
      artwork,
      viewport,
      showPixelGrid,
      showReferenceImage: referenceImage.showReferenceImage,
      referenceImage: referenceImage.referenceImageElement,
      referenceImageAlpha: referenceImage.referenceAlpha,
      paintRevision,
      historyRevision,
    });

  const viewportMinScale = useContainFitViewport({
    cssWidth: cssSize.w,
    cssHeight: cssSize.h,
    artworkWidth: artwork.width,
    artworkHeight: artwork.height,
    setViewport,
    minScaleRef,
  });

  useViewportWheelAndPinch({
    wrapRef,
    setViewport,
    minScaleRef,
    cssWidth: cssSize.w,
    cssHeight: cssSize.h,
    artworkWidth: artwork.width,
    artworkHeight: artwork.height,
  });

  const { onZoomIn, onZoomOut, canZoomIn, canZoomOut } = useToolbarCenterZoom({
    wrapRef,
    setViewport,
    minScaleRef,
    viewportMinScale,
    viewportScale: viewport.scale,
  });

  useViewportKeyboardPan(wrapRef, setViewport);

  useEditorAutosave({
    artworkRef,
    artworkId: artwork.id,
    paintRevision,
    historyRevision,
  });

  const togglePixelGrid = () => setShowPixelGrid((v) => !v);

  useEditorKeyboardShortcuts({
    onTogglePixelGrid: togglePixelGrid,
    undo,
    redo,
  });

  const onCommitStroke = useCallback(
    (cmd: IHistoryCommand) => {
      pushCommand(cmd);
    },
    [pushCommand],
  );

  const handleApplyCanvasSize = useCallback(
    (next: IArtwork) => {
      setArtwork(next);
      schedulePaintBump();
    },
    [schedulePaintBump],
  );

  const togglePanMode = useCallback(() => {
    setPanMode((value) => {
      const next = !value;
      if (next) {
        setBucketMode(false);
      }
      return next;
    });
  }, [setPanMode]);

  const toggleBucketMode = useCallback(() => {
    setBucketMode((value) => {
      const next = !value;
      if (next) {
        setPanMode(false);
      }
      return next;
    });
  }, [setPanMode]);

  const onHiddenActiveLayerPaintAttempt = useCallback(() => {
    showToast({
      message: editor.toasts.hiddenLayer,
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
    bucketMode,
  });

  return {
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
    openPaletteModal: () => setPaletteModalOpen(true),
    closePaletteModal: () => setPaletteModalOpen(false),
    canRemoveSwatch: artwork.palette.length > 1,
    maxPaletteReached: artwork.palette.length >= artworkService.MAX_PALETTE_ENTRIES,
    wrapRef,
    artworkCanvasRef,
    referenceImageCanvasRef,
    gridCanvasRef,
    zoomPanHandlers,
    onArtworkPointerDown,
    layersState,
    layersDrawerOpen,
    toggleLayersDrawer: () => setLayersDrawerOpen((v) => !v),
    closeLayersDrawer: () => setLayersDrawerOpen(false),
    addLayer: () => {
      layersState.addLayer();
    },
    settingsDrawerOpen,
    toggleSettingsDrawer: () => setSettingsDrawerOpen((v) => !v),
    closeSettingsDrawer: () => setSettingsDrawerOpen(false),
    handleApplyCanvasSize,
    viewport,
    cssSize,
    paintRevision,
    showPixelGrid,
    togglePixelGrid,
    referenceImage,
  };
}
