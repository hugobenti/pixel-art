/**
 * Purpose:
 * React hook for canvas viewport: zoom (wheel), pan (wheel / Space+drag / pan mode / middle mouse).
 *
 * Notes:
 * Delegates gesture rules to viewportNavigationService.ts.
 */
"use client";

import type { Dispatch, SetStateAction } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import type { ViewportState } from "@/features/editor/types/editor.types";

import {
  classifyWheelIntent,
  panPixelsFromWheel,
  shouldDeferPrimaryPaint as deferPrimaryPaintRule,
  shouldStartPanGesture,
  translateViewOffset,
} from "@/features/editor/services/viewportNavigationService";

const MAX_SCALE = 64;

/**
 * Wheel listener: pan via Shift+scroll / horizontal trackpad, else zoom toward cursor.
 */
export function attachViewportWheel(
  el: HTMLDivElement,
  setViewport: Dispatch<SetStateAction<ViewportState>>,
  getMinScale: () => number
): () => void {
  const onWheel = (e: WheelEvent) => {
    e.preventDefault();

    if (classifyWheelIntent(e) === "pan") {
      const { dx, dy } = panPixelsFromWheel(e);
      setViewport((v) => ({
        ...v,
        viewOffset: translateViewOffset(v.viewOffset, dx, dy),
      }));
      return;
    }

    const rect = el.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const delta = -e.deltaY;
    const factor = delta > 0 ? 1.08 : 0.92;
    const minScale = Math.max(1e-6, getMinScale());

    setViewport((v) => {
      const newScale = Math.min(
        MAX_SCALE,
        Math.max(minScale, v.scale * factor)
      );
      const worldX = (mx - v.viewOffset.x) / v.scale;
      const worldY = (my - v.viewOffset.y) / v.scale;
      return {
        scale: newScale,
        viewOffset: {
          x: mx - worldX * newScale,
          y: my - worldY * newScale,
        },
      };
    });
  };

  el.addEventListener("wheel", onWheel, { passive: false });
  return () => el.removeEventListener("wheel", onWheel);
}

export function useViewportNavigation() {
  const [viewport, setViewport] = useState<ViewportState>({
    scale: 1,
    viewOffset: { x: 0, y: 0 },
  });

  const [panMode, setPanMode] = useState(false);

  const spaceDownRef = useRef(false);
  const panModeRef = useRef(false);

  useEffect(() => {
    panModeRef.current = panMode;
  }, [panMode]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code !== "Space") {
        return;
      }
      const t = e.target;
      if (
        t instanceof HTMLInputElement ||
        t instanceof HTMLTextAreaElement ||
        (t instanceof HTMLElement && t.isContentEditable)
      ) {
        return;
      }
      e.preventDefault();
      spaceDownRef.current = true;
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        spaceDownRef.current = false;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  const panRef = useRef({
    active: false,
    pointerId: 0,
    startClientX: 0,
    startClientY: 0,
    originOffsetX: 0,
    originOffsetY: 0,
  });

  const viewOffsetRef = useRef(viewport.viewOffset);
  useEffect(() => {
    viewOffsetRef.current = viewport.viewOffset;
  }, [viewport.viewOffset]);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (
      !shouldStartPanGesture({
        pointerButton: e.button,
        spaceHeld: spaceDownRef.current,
        panMode: panModeRef.current,
      })
    ) {
      return;
    }
    e.preventDefault();
    panRef.current = {
      active: true,
      pointerId: e.pointerId,
      startClientX: e.clientX,
      startClientY: e.clientY,
      originOffsetX: viewOffsetRef.current.x,
      originOffsetY: viewOffsetRef.current.y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!panRef.current.active || e.pointerId !== panRef.current.pointerId) {
      return;
    }
    const dx = e.clientX - panRef.current.startClientX;
    const dy = e.clientY - panRef.current.startClientY;
    setViewport((v) => ({
      ...v,
      viewOffset: {
        x: panRef.current.originOffsetX + dx,
        y: panRef.current.originOffsetY + dy,
      },
    }));
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!panRef.current.active || e.pointerId !== panRef.current.pointerId) {
      return;
    }
    panRef.current.active = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  }, []);

  const onPointerCancel = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    panRef.current.active = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  }, []);

  const deferPrimaryPaint = useCallback(() => {
    return deferPrimaryPaintRule({
      spaceHeld: spaceDownRef.current,
      panMode: panModeRef.current,
    });
  }, []);

  return {
    viewport,
    setViewport,
    panMode,
    setPanMode,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
    },
    deferPrimaryPaint,
  };
}
