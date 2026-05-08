/**
 * Purpose:
 * Interactive pixel editor: viewport, layered canvases, painting, undo/redo, overlays, and autosave.
 *
 * Notes:
 * Pixel grid and symmetry-guide colors are defined on :root in globals.css (read by the canvas engine).
 * Contain-fit viewport uses normalizeViewportToPixelGrid so scale and offsets stay integer-aligned with wheel/pinch/pan.
 * Touch pointer tracking: useEditorPointerContacts runs before viewport navigation and pixel painting (see docs/canvas-pointer-contract.md).
 * Toolbar zoom uses multiplicative steps plus an integer ±1 fallback when pixel snapping would leave scale unchanged.
 */
"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { CanvasContainer } from "@/features/editor/components/CanvasContainer";
import { ColorSelectionRow } from "@/features/editor/components/ColorSelectionRow";
import { EditorActionsBar } from "@/features/editor/components/EditorActionsBar";
import { LayersDrawer } from "@/features/editor/components/LayersDrawer";
import { PaletteEditModal } from "@/features/editor/components/PaletteEditModal";
import { ShiftDirectionOverlay } from "@/features/editor/components/ShiftDirectionOverlay";
import { useArtworkLayers } from "@/features/editor/hooks/useArtworkLayers";
import { useEditorPalette } from "@/features/editor/hooks/useEditorPalette";
import { useEditorPointerContacts } from "@/features/editor/hooks/useEditorPointerContacts";
import {
  attachViewportPinchZoom,
  attachViewportWheel,
  useViewportNavigation,
  zoomViewportTowardScreenPointSnapped,
} from "@/features/editor/hooks/useViewportNavigation";
import { useCanvasEngine } from "@/features/editor/hooks/useCanvasEngine";
import { useHistory } from "@/features/editor/hooks/useHistory";
import { usePixelShift } from "@/features/editor/hooks/usePixelShift";
import { usePixelPainting } from "@/features/editor/hooks/usePixelPainting";
import { useReferenceImage } from "@/features/editor/hooks/useReferenceImage";
import * as galleryService from "@/features/gallery/services/galleryService";

import type { Artwork } from "@/features/editor/types/editor.types";

import {
  MAX_VIEWPORT_SCALE,
  normalizeViewportToPixelGrid,
} from "@/features/editor/logic/viewportPixelAlign";
import { computeContainFit } from "@/features/editor/logic/viewportFit";
import { artworkToWebpThumbnail } from "@/features/editor/utils/thumbnail";

const MIN_ZOOM_RATIO_OF_CONTAIN = 0.75;

/** Initial multiplicative step; integer bump applied when rounding yields no change (typical at low scales). */
const VIEWPORT_ZOOM_FACTOR_IN = 1.08;
const VIEWPORT_ZOOM_FACTOR_OUT = 0.92;

/** Logs [editor-zoom] in development, or when localStorage DEBUG_EDITOR_ZOOM=1 is set (e.g. mobile prod builds). */
function editorZoomDebug(payload: Record<string, unknown>) {
  if (typeof window === "undefined") {
    return;
  }
  const force = window.localStorage?.getItem("DEBUG_EDITOR_ZOOM") === "1";
  if (process.env.NODE_ENV === "development" || force) {
    console.log("[editor-zoom]", payload);
  }
}

const shellClass =
  "mx-auto flex h-[min(100dvh,100vh)] w-full max-w-6xl flex-col gap-2 px-4 py-4 min-h-0";

const chromeClass = "flex shrink-0 flex-col gap-0";

const mainClass = "flex min-h-0 flex-1 flex-col";

interface EditorWorkspaceProps {
  initialArtwork: Artwork;
}

export function EditorWorkspace({ initialArtwork }: EditorWorkspaceProps) {
  const [artwork, setArtwork] = useState<Artwork>(initialArtwork);

  const [showPixelGrid, setShowPixelGrid] = useState(true);
  const [paintRevision, setPaintRevision] = useState(0);
  const [paletteModalOpen, setPaletteModalOpen] = useState(false);
  const [layersDrawerOpen, setLayersDrawerOpen] = useState(false);

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

  const primaryPaint = Math.min(
    paletteUi.primaryIndex,
    Math.max(0, artwork.palette.length - 1)
  );
  const secondaryPaint = Math.min(
    paletteUi.secondaryIndex,
    Math.max(0, artwork.palette.length - 1)
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
  } = useHistory({ documentKey: artwork.id, getLayerPixelData });

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

  const zoomViewportAroundCenter = useCallback(
    (direction: "in" | "out") => {
      const el = wrapRef.current;
      if (!el) {
        editorZoomDebug({
          phase: "abort",
          reason: "wrapRef_null",
          direction,
        });
        return;
      }
      const rect = el.getBoundingClientRect();
      const mx = rect.width / 2;
      const my = rect.height / 2;
      const minScale = minScaleRef.current;
      const minScaleFloor = Math.max(1, Math.ceil(minScale));
      const factor =
        direction === "in" ? VIEWPORT_ZOOM_FACTOR_IN : VIEWPORT_ZOOM_FACTOR_OUT;

      setViewport((v) => {
        const multiplicative = Math.min(
          MAX_VIEWPORT_SCALE,
          Math.max(minScale, v.scale * factor)
        );
        let candidateScale = multiplicative;

        const snappedMultiplicative = normalizeViewportToPixelGrid(
          { ...v, scale: multiplicative },
          { minScale, maxScale: MAX_VIEWPORT_SCALE }
        ).scale;

        let usedIntegerBump = false;
        if (snappedMultiplicative === v.scale) {
          usedIntegerBump = true;
          if (direction === "in") {
            candidateScale = Math.min(MAX_VIEWPORT_SCALE, v.scale + 1);
          } else {
            candidateScale = Math.max(minScaleFloor, v.scale - 1);
          }
        }

        const next = zoomViewportTowardScreenPointSnapped(
          v,
          candidateScale,
          mx,
          my,
          {
            minScale,
            maxScale: MAX_VIEWPORT_SCALE,
          }
        );

        editorZoomDebug({
          phase: "apply",
          direction,
          prevScale: v.scale,
          multiplicativeCandidate: multiplicative,
          snappedMultiplicative,
          usedIntegerBump,
          finalCandidate: candidateScale,
          nextScale: next.scale,
          unchanged: next === v,
          anchor: { mx, my },
          wrapSize: { w: rect.width, h: rect.height },
          minScale,
          minScaleFloor,
        });

        return next;
      });
    },
    [setViewport, wrapRef]
  );

  const onZoomIn = useCallback(() => {
    zoomViewportAroundCenter("in");
  }, [zoomViewportAroundCenter]);

  const onZoomOut = useCallback(() => {
    zoomViewportAroundCenter("out");
  }, [zoomViewportAroundCenter]);

  const minScaleFloor = Math.max(1, Math.ceil(minScaleRef.current));
  const canZoomIn = viewport.scale < MAX_VIEWPORT_SCALE;
  const canZoomOut = viewport.scale > minScaleFloor;

  const onCommitStroke = useCallback(
    (cmd: import("@/features/editor/types/editor.types").HistoryCommand) => {
      pushCommand(cmd);
    },
    [pushCommand]
  );

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
  });

  const skipInitialAutosave = useRef(true);

  useEffect(() => {
    if (skipInitialAutosave.current) {
      skipInitialAutosave.current = false;
      return;
    }
    const handle = window.setTimeout(() => {
      const current = artworkRef.current;
      if (!current) {
        return;
      }
      const thumb =
        typeof document !== "undefined"
          ? artworkToWebpThumbnail(current)
          : current.thumbnail;
      void galleryService.saveArtwork({
        ...current,
        thumbnail: thumb || current.thumbnail,
      });
    }, 650);

    return () => window.clearTimeout(handle);
  }, [artwork.id, paintRevision, historyRevision]);

  useEffect(() => {
    return () => {
      const current = artworkRef.current;
      if (current && typeof document !== "undefined") {
        const thumb = artworkToWebpThumbnail(current);
        void galleryService.saveArtwork({
          ...current,
          thumbnail: thumb || current.thumbnail,
        });
      }
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const lower = e.key.toLowerCase();
      if (lower === "g" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
        if (tag === "input" || tag === "textarea") {
          return;
        }
        e.preventDefault();
        setShowPixelGrid((v) => !v);
      }
      if ((e.ctrlKey || e.metaKey) && lower === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo]);

  return (
    <div className={shellClass}>
      <div className={chromeClass}>
        <ColorSelectionRow
          palette={artwork.palette}
          primaryIndex={primaryPaint}
          secondaryIndex={secondaryPaint}
          focusedSwatchIndex={paletteUi.focusedSwatchIndex}
          onSwatchPick={paletteUi.assignSwatchToActiveSlot}
        />
        <EditorActionsBar
          title={artwork.title}
          showPixelGrid={showPixelGrid}
          onToggleGrid={() => setShowPixelGrid((v) => !v)}
          showReferenceImage={referenceImage.showReferenceImage}
          hasReferenceImage={referenceImage.hasReferenceImage}
          onToggleReferenceImage={referenceImage.onToggleReferenceImage}
          onLoadReferenceImage={referenceImage.onLoadReferenceImage}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={undo}
          onRedo={redo}
          activeSlot={paletteUi.activeSlot}
          onToggleActiveSlot={paletteUi.toggleActiveSlot}
          onOpenPaletteModal={() => setPaletteModalOpen(true)}
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
          onRenameLayer={(layerId) => {
            const current = artwork.layers.find((layer) => layer.id === layerId);
            if (!current) {
              return;
            }
            const nextName = window.prompt("Layer name", current.name);
            if (typeof nextName !== "string") {
              return;
            }
            layersState.renameLayer(layerId, nextName);
          }}
          onReorderLayers={layersState.reorderLayers}
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
