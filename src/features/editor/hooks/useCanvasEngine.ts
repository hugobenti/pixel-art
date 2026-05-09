/**
 * Purpose:
 * Bind editor canvases to viewport size and schedule artwork/reference/grid renders.
 *
 * Notes (optional):
 * Grid and symmetry-guide colors come from CSS custom properties on :root so they stay aligned with design tokens.
 */
"use client";

import { useLayoutEffect, useRef, useState } from "react";

import { EDITOR_ROOT_CSS_VARS } from "@/features/editor/constants/editorRootCssVars";
import { renderCanvas } from "@/features/editor/logic/canvasRender";
import { renderPixelGrid } from "@/features/editor/logic/gridRender";
import { renderReferenceImage } from "@/features/editor/logic/referenceImageRender";
import type { Artwork, ViewportState } from "@/features/editor/types/editor.types";

interface UseCanvasEngineParams {
  artwork: Artwork | null;
  viewport: ViewportState;
  showPixelGrid: boolean;
  showReferenceImage: boolean;
  referenceImage: HTMLImageElement | null;
  referenceImageAlpha: number;
  /** Bumps when pixel buffer or history mutates without artwork reference changes. */
  paintRevision: number;
  historyRevision: number;
}

function readRootCssColor(primaryVar: string, fallbackVar: string): string {
  if (typeof document === "undefined") {
    return "";
  }
  const root = document.documentElement;
  const primary = getComputedStyle(root).getPropertyValue(primaryVar).trim();
  if (primary.length > 0) {
    return primary;
  }
  return getComputedStyle(root).getPropertyValue(fallbackVar).trim();
}

export function useCanvasEngine({
  artwork,
  viewport,
  showPixelGrid,
  showReferenceImage,
  referenceImage,
  referenceImageAlpha,
  paintRevision,
  historyRevision,
}: UseCanvasEngineParams) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const artworkCanvasRef = useRef<HTMLCanvasElement>(null);
  const referenceImageCanvasRef = useRef<HTMLCanvasElement>(null);
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
    const rc = referenceImageCanvasRef.current;
    const gc = gridCanvasRef.current;
    if (!artwork || !ac || !rc || !gc) {
      return;
    }

    ac.width = cssSize.w;
    ac.height = cssSize.h;
    rc.width = cssSize.w;
    rc.height = cssSize.h;
    gc.width = cssSize.w;
    gc.height = cssSize.h;

    const actx = ac.getContext("2d");
    const rctx = rc.getContext("2d");
    const gctx = gc.getContext("2d");
    if (!actx || !rctx || !gctx) {
      return;
    }

    renderCanvas(actx, artwork, viewport);
    if (showReferenceImage && referenceImage) {
      renderReferenceImage(
        rctx,
        referenceImage,
        artwork.width,
        artwork.height,
        viewport,
        referenceImageAlpha
      );
    } else {
      rctx.clearRect(0, 0, rc.width, rc.height);
    }

    if (showPixelGrid) {
      const gridColor = readRootCssColor(
        EDITOR_ROOT_CSS_VARS.gridLine,
        EDITOR_ROOT_CSS_VARS.gridLineFallback
      );
      const centerH = readRootCssColor(
        EDITOR_ROOT_CSS_VARS.centerHorizontal,
        EDITOR_ROOT_CSS_VARS.centerHorizontalFallback
      );
      const centerV = readRootCssColor(
        EDITOR_ROOT_CSS_VARS.centerVertical,
        EDITOR_ROOT_CSS_VARS.centerVerticalFallback
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
    showReferenceImage,
    referenceImage,
    referenceImageAlpha,
    cssSize.w,
    cssSize.h,
    paintRevision,
    historyRevision,
  ]);

  return { wrapRef, artworkCanvasRef, referenceImageCanvasRef, gridCanvasRef, cssSize };
}
