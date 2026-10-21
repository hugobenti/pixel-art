/**
 * Purpose:
 * Editor workspace controller: artwork state, history, viewport, canvases, painting, overlays and autosave.
 *
 * Notes:
 * Contain-fit viewport uses normalizeViewportToPixelGrid so scale and offsets stay integer-aligned with wheel/pinch/pan.
 * Touch pointer tracking: useEditorPointerContacts runs before viewport navigation and pixel painting (see docs/canvas-pointer-contract.md).
 * Toolbar zoom logic lives in useToolbarCenterZoom + logic/toolbarCenterZoom.ts.
 */

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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
import * as artworkService from "@/features/shared/artwork/artworkService";

import { useToast } from "@/features/shared/components/Toast/hooks/useToast";

import type { HistoryCommand } from "@/features/editor/types/editor.types";
import type { Artwork } from "@/features/shared/artwork/artwork.types";

import { EDITOR_TOAST_HIDDEN_LAYER_MESSAGE } from "@/features/editor/constants/editorToastMessages";
import { clampPaletteIndex } from "@/features/editor/logic/paletteMutations";
import { computeContainFit } from "@/features/editor/logic/viewportFit";
import {
  MIN_ZOOM_RATIO_OF_CONTAIN,
  computeViewportMinScale,
} from "@/features/editor/logic/viewportMinScale";
import {
  MAX_VIEWPORT_SCALE,
  normalizeViewportToPixelGrid,
} from "@/features/editor/logic/viewportPixelAlign";

export function useEditorWorkspace(initialArtwork: Artwork) {
  const { showToast } = useToast();
  const [artwork, setArtwork] = useState<Artwork>(initialArtwork);

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
      computeViewportMinScale(cssSize.w, cssSize.h, artwork.width, artwork.height),
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

  const togglePixelGrid = useCallback(() => setShowPixelGrid((v) => !v), []);

  useEditorKeyboardShortcuts({
    onTogglePixelGrid: togglePixelGrid,
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
    (cmd: HistoryCommand) => {
      pushCommand(cmd);
    },
    [pushCommand]
  );

  const handleApplyCanvasSize = useCallback((next: Artwork) => {
    setArtwork(next);
    schedulePaintBump();
  }, [schedulePaintBump]);

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
    bucketMode,
  });

  const openPaletteModal = useCallback(() => setPaletteModalOpen(true), []);
  const closePaletteModal = useCallback(() => setPaletteModalOpen(false), []);
  const toggleLayersDrawer = useCallback(
    () => setLayersDrawerOpen((v) => !v),
    []
  );
  const closeLayersDrawer = useCallback(() => setLayersDrawerOpen(false), []);
  const toggleSettingsDrawer = useCallback(
    () => setSettingsDrawerOpen((v) => !v),
    []
  );
  const closeSettingsDrawer = useCallback(
    () => setSettingsDrawerOpen(false),
    []
  );
  const { addLayer } = layersState;
  const handleAddLayer = useCallback(() => {
    addLayer();
  }, [addLayer]);

  return {
    artwork,
    primaryPaint,
    secondaryPaint,
    paletteUi,
    layersState,
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
    canRemoveSwatch: artwork.palette.length > 1,
    maxPaletteReached:
      artwork.palette.length >= artworkService.MAX_PALETTE_ENTRIES,
    layersDrawerOpen,
    toggleLayersDrawer,
    closeLayersDrawer,
    handleAddLayer,
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
    wrapRef,
    artworkCanvasRef,
    referenceImageCanvasRef,
    gridCanvasRef,
    zoomPanHandlers,
    onArtworkPointerDown,
  };
}
