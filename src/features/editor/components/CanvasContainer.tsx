/**
 * Purpose:
 * Viewport wrapper with checkerboard backdrop and stacked artwork + reference + grid canvases.
 */
"use client";

import type { RefObject } from "react";

import { canvasContainer } from "@/features/editor/components/CanvasContainer.style";
import { PixelGridOverlay } from "@/features/editor/components/PixelGridOverlay";
import { ReferenceImageOverlay } from "@/features/editor/components/ReferenceImageOverlay";
import { useCanvasContainer } from "@/features/editor/components/useCanvasContainer";

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

export function CanvasContainer({
  wrapRef,
  artworkCanvasRef,
  referenceImageCanvasRef,
  gridCanvasRef,
  viewportHandlers,
  onArtworkPointerDown,
}: CanvasContainerProps) {
  const { onArtworkContextMenu } = useCanvasContainer();

  return (
    <div className={canvasContainer.base}>
      <div className={canvasContainer.checker} aria-hidden />
      <div
        ref={wrapRef}
        className={canvasContainer.stack}
        {...viewportHandlers}
        role="application"
        tabIndex={0}
      >
        <canvas
          ref={artworkCanvasRef}
          className={canvasContainer.artworkCanvas}
          onPointerDown={onArtworkPointerDown}
          onContextMenu={onArtworkContextMenu}
        />
        <ReferenceImageOverlay canvasRef={referenceImageCanvasRef} />
        <PixelGridOverlay canvasRef={gridCanvasRef} />
      </div>
    </div>
  );
}
