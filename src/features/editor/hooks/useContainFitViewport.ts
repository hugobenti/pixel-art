/**
 * Purpose:
 * Resets the viewport to the pixel-aligned contain fit whenever the viewport box or the artwork size
 * changes, and keeps the zoom-out limit (minScaleRef) in step with it.
 *
 * Notes:
 * Returns the same limit for render (toolbar zoom-out state) so it is never read from the ref during render.
 */
"use client";

import { useLayoutEffect, useMemo } from "react";

import { containFitViewport } from "@/features/editor/logic/viewportFit";
import type { IUseContainFitViewportParams } from "./useContainFitViewport.type";

export function useContainFitViewport({
  cssWidth,
  cssHeight,
  artworkWidth,
  artworkHeight,
  setViewport,
  minScaleRef,
}: IUseContainFitViewportParams) {
  const viewportMinScale = useMemo(
    () => containFitViewport(cssWidth, cssHeight, artworkWidth, artworkHeight).minScale,
    [cssWidth, cssHeight, artworkWidth, artworkHeight],
  );

  useLayoutEffect(() => {
    const fit = containFitViewport(cssWidth, cssHeight, artworkWidth, artworkHeight);
    minScaleRef.current = fit.minScale;
    setViewport(fit.viewport);
  }, [cssWidth, cssHeight, artworkWidth, artworkHeight, setViewport, minScaleRef]);

  return viewportMinScale;
}
