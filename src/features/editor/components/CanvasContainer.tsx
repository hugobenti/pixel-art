/**
 * Purpose:
 * Viewport wrapper with checkerboard backdrop and stacked artwork + reference + grid canvases.
 */
"use client";

import type { RefObject } from "react";

import { PixelGridOverlay } from "@/features/editor/components/PixelGridOverlay";
import { ReferenceImageOverlay } from "@/features/editor/components/ReferenceImageOverlay";

const viewportShell =
  "relative flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100";

const checkerLayer =
  "pixel-checkerboard pointer-events-none absolute inset-0 rounded-[inherit]";

const canvasStack =
  "relative z-10 h-full min-h-0 w-full min-w-0 flex-1";

interface CanvasContainerProps {
  wrapRef: RefObject<HTMLDivElement | null>;
  artworkCanvasRef: RefObject<HTMLCanvasElement | null>;
  referenceImageCanvasRef: RefObject<HTMLCanvasElement | null>;
  gridCanvasRef: RefObject<HTMLCanvasElement | null>;
  viewportHandlers: {
    onPointerDown: React.PointerEventHandler<HTMLDivElement>;
    onPointerMove: React.PointerEventHandler<HTMLDivElement>;
    onPointerUp: React.PointerEventHandler<HTMLDivElement>;
    onPointerCancel: React.PointerEventHandler<HTMLDivElement>;
  };
  onArtworkPointerDown: React.PointerEventHandler<HTMLCanvasElement>;
}

const artworkCanvasClass =
  "absolute inset-0 block h-full w-full cursor-crosshair touch-none";

export function CanvasContainer({
  wrapRef,
  artworkCanvasRef,
  referenceImageCanvasRef,
  gridCanvasRef,
  viewportHandlers,
  onArtworkPointerDown,
}: CanvasContainerProps) {
  return (
    <div className={viewportShell}>
      <div className={checkerLayer} aria-hidden />
      <div
        ref={wrapRef}
        className={canvasStack}
        {...viewportHandlers}
        role="application"
        tabIndex={0}
      >
        <canvas
          ref={artworkCanvasRef}
          className={artworkCanvasClass}
          onPointerDown={onArtworkPointerDown}
          onContextMenu={(e) => e.preventDefault()}
        />
        <ReferenceImageOverlay canvasRef={referenceImageCanvasRef} />
        <PixelGridOverlay canvasRef={gridCanvasRef} />
      </div>
    </div>
  );
}
