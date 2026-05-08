/**
 * Purpose:
 * Bind artwork and grid canvases to viewport size and schedule dual-layer renders.
 *
 * Notes (optional):
 * Grid and symmetry-guide colors come from CSS custom properties on :root so they stay aligned with design tokens.
 */
"use client";

import { useLayoutEffect, useRef, useState } from "react";

import { renderCanvas } from "@/features/editor/logic/canvasRender";
import { renderPixelGrid } from "@/features/editor/logic/gridRender";
import type { Artwork, ViewportState } from "@/features/editor/types/editor.types";

interface UseCanvasEngineParams {
  artwork: Artwork | null;
  viewport: ViewportState;
  showPixelGrid: boolean;
  /** Bumps when pixel buffer or history mutates without artwork reference changes. */
  paintRevision: number;
  historyRevision: number;
}

function readRootCssColor(varName: string, fallback: string): string {
  if (typeof document === "undefined") {
    return fallback;
  }
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
  return raw.length > 0 ? raw : fallback;
}

export function useCanvasEngine({
  artwork,
  viewport,
  showPixelGrid,
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
      const gridColor = readRootCssColor(
        "--color-editor-grid-line",
        "rgba(0, 0, 0, 0.35)"
      );
      const centerH = readRootCssColor(
        "--color-editor-grid-center-horizontal",
        "rgb(239, 68, 68)"
      );
      const centerV = readRootCssColor(
        "--color-editor-grid-center-vertical",
        "rgb(59, 130, 246)"
      );
      renderPixelGrid(
        gctx,
        artwork.width,
        artwork.height,
        viewport,
        {
          color: gridColor,
          centerHorizontalColor: centerH,
          centerVerticalColor: centerV,
        },
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
    cssSize.w,
    cssSize.h,
    paintRevision,
    historyRevision,
  ]);

  return { wrapRef, artworkCanvasRef, gridCanvasRef, cssSize };
}
