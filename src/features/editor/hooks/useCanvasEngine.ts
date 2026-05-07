/**
 * Purpose:
 * Bind artwork and grid canvases to viewport size and schedule dual-layer renders.
 */
"use client";

import { useLayoutEffect, useRef, useState } from "react";

import { renderCanvas } from "@/features/editor/logic/canvasRender";
import { renderPixelGrid } from "@/features/editor/logic/gridRender";
import type { Artwork } from "@/features/editor/types/editor.types";
import type { ViewportState } from "@/features/editor/types/editor.types";

interface UseCanvasEngineParams {
  artwork: Artwork | null;
  viewport: ViewportState;
  showPixelGrid: boolean;
  /** CSS color string for grid strokes (canvas API). */
  gridStrokeColor: string;
  /** Bumps when pixel buffer or history mutates without artwork reference changes. */
  paintRevision: number;
  historyRevision: number;
}

export function useCanvasEngine({
  artwork,
  viewport,
  showPixelGrid,
  gridStrokeColor,
  paintRevision,
  historyRevision,
}: UseCanvasEngineParams) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const artworkCanvasRef = useRef<HTMLCanvasElement>(null);
  const gridCanvasRef = useRef<HTMLCanvasElement>(null);
  const [cssSize, setCssSize] = useState({ w: 320, h: 320 });

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) {
      return;
    }
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setCssSize({
        w: Math.max(1, Math.floor(r.width)),
        h: Math.max(1, Math.floor(r.height)),
      });
    });
    ro.observe(el);
    const r = el.getBoundingClientRect();
    setCssSize({
      w: Math.max(1, Math.floor(r.width)),
      h: Math.max(1, Math.floor(r.height)),
    });
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(() => {
    const ac = artworkCanvasRef.current;
    const gc = gridCanvasRef.current;
    if (!artwork || !ac || !gc) {
      return;
    }

    ac.width = cssSize.w;
    ac.height = cssSize.h;
    gc.width = cssSize.w;
    gc.height = cssSize.h;

    const actx = ac.getContext("2d");
    const gctx = gc.getContext("2d");
    if (!actx || !gctx) {
      return;
    }

    renderCanvas(actx, artwork, viewport);

    if (showPixelGrid) {
      renderPixelGrid(
        gctx,
        artwork.width,
        artwork.height,
        viewport,
        { color: gridStrokeColor },
        cssSize.w,
        cssSize.h
      );
    } else {
      gctx.clearRect(0, 0, gc.width, gc.height);
    }
  }, [
    artwork,
    viewport,
    showPixelGrid,
    gridStrokeColor,
    cssSize.w,
    cssSize.h,
    paintRevision,
    historyRevision,
  ]);

  return { wrapRef, artworkCanvasRef, gridCanvasRef, cssSize };
}
