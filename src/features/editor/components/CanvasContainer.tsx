/**
 * Purpose:
 * Viewport wrapper with checkerboard backdrop and stacked artwork + reference + grid canvases.
 */
"use client";
import { editor } from "@/content/editor";
import { PixelGridOverlay } from "@/features/editor/components/PixelGridOverlay";
import { ReferenceImageOverlay } from "@/features/editor/components/ReferenceImageOverlay";
import type { ICanvasContainerProps } from "./CanvasContainer.type";

const viewportShell =
  "relative flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-lg border border-line bg-surface-muted";

const checkerLayer =
  "pixel-checkerboard pointer-events-none absolute inset-0 rounded-[inherit]";

const canvasStack =
  "relative z-10 h-full min-h-0 w-full min-w-0 flex-1 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 data-pointer-focus:focus-visible:outline-none";
const artworkCanvasClass =
  "absolute inset-0 block h-full w-full cursor-crosshair touch-none";

export function CanvasContainer({
  wrapRef,
  artworkCanvasRef,
  referenceImageCanvasRef,
  gridCanvasRef,
  viewportHandlers,
  onArtworkPointerDown,
}: ICanvasContainerProps) {
  return (
    <div className={viewportShell}>
      <div className={checkerLayer} aria-hidden />
      <div
        ref={wrapRef}
        className={canvasStack}
        {...viewportHandlers}
        role="application"
        aria-label={editor.viewport.label}
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
