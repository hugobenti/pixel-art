/**
 * Purpose:
 * Interactive pixel editor: viewport, dual canvases, painting, undo/redo, grid overlay, and autosave.
 *
 * Notes:
 * Grid stroke color is fixed for the app’s light theme (no system dark-mode sync).
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
import { PaletteEditModal } from "@/features/editor/components/PaletteEditModal";
import { useEditorPalette } from "@/features/editor/hooks/useEditorPalette";
import {
  attachViewportPinchZoom,
  attachViewportWheel,
  useViewportNavigation,
} from "@/features/editor/hooks/useViewportNavigation";
import { useCanvasEngine } from "@/features/editor/hooks/useCanvasEngine";
import { useHistory } from "@/features/editor/hooks/useHistory";
import { usePixelPainting } from "@/features/editor/hooks/usePixelPainting";
import * as galleryService from "@/features/gallery/services/galleryService";

import type { Artwork } from "@/features/editor/types/editor.types";

import { computeContainFit } from "@/features/editor/logic/viewportFit";
import { artworkToWebpThumbnail } from "@/features/editor/utils/thumbnail";

const MIN_ZOOM_RATIO_OF_CONTAIN = 0.75;

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

  const gridStrokeColor = "rgba(0, 0, 0, 0.22)";

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

  const {
    pushCommand,
    undo,
    redo,
    canUndo,
    canRedo,
    historyRevision,
  } = useHistory(artwork.pixelData, artwork.id);

  const {
    viewport,
    setViewport,
    handlers: zoomPanHandlers,
    panMode,
    setPanMode,
    deferPrimaryPaint,
  } = useViewportNavigation();

  const minScaleRef = useRef(1);

  const {
    wrapRef,
    artworkCanvasRef,
    gridCanvasRef,
    cssSize,
  } = useCanvasEngine({
    artwork,
    viewport,
    showPixelGrid,
    gridStrokeColor,
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
    minScaleRef.current = next.scale * MIN_ZOOM_RATIO_OF_CONTAIN;
    setViewport(next);
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

  const { onArtworkPointerDown } = usePixelPainting({
    artwork,
    viewport,
    canvasRef: artworkCanvasRef,
    activeSlot: paletteUi.activeSlot,
    primaryPaletteIndex: primaryPaint,
    secondaryPaletteIndex: secondaryPaint,
    onCommitStroke,
    onPixelsChanged: schedulePaintBump,
    deferPrimaryPaint,
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
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={undo}
          onRedo={redo}
          activeSlot={paletteUi.activeSlot}
          onToggleActiveSlot={paletteUi.toggleActiveSlot}
          onOpenPaletteModal={() => setPaletteModalOpen(true)}
          panMode={panMode}
          onTogglePanMode={() => setPanMode((v) => !v)}
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
          gridCanvasRef={gridCanvasRef}
          viewportHandlers={zoomPanHandlers}
          onArtworkPointerDown={onArtworkPointerDown}
        />
      </main>
    </div>
  );
}
