/**
 * Purpose:
 * Toolbar +/- zoom toward the canvas wrap center (delegates math to toolbarCenterZoom logic).
 *
 * Notes:
 * Pass viewportMinScale from the same contain-fit math as minScaleRef so zoom-out limits stay consistent without reading refs during render.
 */
"use client";

import type { RefObject } from "react";
import { useCallback } from "react";
import type { Dispatch, SetStateAction } from "react";

import type { ViewportState } from "@/features/editor/types/editor.types";

import { MAX_VIEWPORT_SCALE } from "@/features/editor/logic/viewportPixelAlign";
import {
  computeToolbarZoomAroundCenter,
  editorZoomDebug,
} from "@/features/editor/logic/toolbarCenterZoom";

export interface UseToolbarCenterZoomParams {
  wrapRef: RefObject<HTMLDivElement | null>;
  setViewport: Dispatch<SetStateAction<ViewportState>>;
  minScaleRef: RefObject<number>;
  /** Minimum scale from contain-fit; drives zoom-out limit without reading refs during render. */
  viewportMinScale: number;
  viewportScale: number;
}

export function useToolbarCenterZoom({
  wrapRef,
  setViewport,
  minScaleRef,
  viewportMinScale,
  viewportScale,
}: UseToolbarCenterZoomParams) {
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
