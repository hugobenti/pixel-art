/**
 * Purpose:
 * Toolbar +/- zoom toward the canvas wrap center (delegates math to toolbarCenterZoom logic).
 *
 * Notes:
 * Pass viewportMinScale from the same contain-fit math as minScaleRef so zoom-out limits stay consistent without reading refs during render.
 */
"use client";
import { useCallback } from "react";
import { MAX_VIEWPORT_SCALE } from "@/features/editor/logic/viewportPixelAlign";
import {
  computeToolbarZoomAroundCenter,
  editorZoomDebug,
} from "@/features/editor/logic/toolbarCenterZoom";
import type { IUseToolbarCenterZoomParams } from "./useToolbarCenterZoom.type";

export function useToolbarCenterZoom({
  wrapRef,
  setViewport,
  minScaleRef,
  viewportMinScale,
  viewportScale,
}: IUseToolbarCenterZoomParams) {
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
      const minScale = minScaleRef.current;
      const opts = { minScale, maxScale: MAX_VIEWPORT_SCALE };
      setViewport((v) =>
        computeToolbarZoomAroundCenter(v, direction, {
          wrapEl: el,
          minScale,
          normalizeOpts: opts,
        })
      );
    },
    [setViewport, wrapRef, minScaleRef]
  );

  const onZoomIn = useCallback(() => {
    zoomViewportAroundCenter("in");
  }, [zoomViewportAroundCenter]);

  const onZoomOut = useCallback(() => {
    zoomViewportAroundCenter("out");
  }, [zoomViewportAroundCenter]);

  const minScaleFloor = Math.max(1, Math.ceil(viewportMinScale));
  const canZoomIn = viewportScale < MAX_VIEWPORT_SCALE;
  const canZoomOut = viewportScale > minScaleFloor;

  return { onZoomIn, onZoomOut, canZoomIn, canZoomOut };
}
