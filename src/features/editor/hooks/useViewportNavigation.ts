/**
 * Purpose:
 * React hook for canvas viewport: zoom (wheel / two-finger pinch), pan (wheel / Space+drag / pan mode / middle mouse).
 *
 * Notes:
 * Delegates gesture rules to viewportNavigationService.ts. Touch contact counts come from useEditorPointerContacts
 * (touchPointersRef) — do not duplicate touch tracking here. Mobile pinch is implemented here because
 * `touch-action: none` on the canvas disables browser pinch-zoom and wheel events are unreliable on touch devices.
 * Viewport updates pass through normalizeViewportToPixelGrid for crisp pixel scaling (integer scale + offsets).
 */
"use client";

import type { Dispatch, RefObject, SetStateAction } from "react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import type { ViewportState } from "@/features/editor/types/editor.types";

import {
  MAX_VIEWPORT_SCALE,
  normalizeViewportToPixelGrid,
} from "@/features/editor/logic/viewportPixelAlign";
import { zoomViewportTowardScreenPointSnapped } from "@/features/editor/logic/viewportZoomMath";

export {
  zoomViewportTowardScreenPoint,
  zoomViewportTowardScreenPointSnapped,
} from "@/features/editor/logic/viewportZoomMath";

import {
  classifyWheelIntent,
  panPixelsFromWheel,
  shouldDeferPrimaryPaint as deferPrimaryPaintRule,
  shouldStartPanGesture,
  translateViewOffset,
} from "@/features/editor/services/viewportNavigationService";

export interface UseViewportNavigationOptions {
  /** Minimum scale from contain-fit ratio; used when snapping zoom/pan to integer pixels. */
  getMinScale?: () => number;
  /** Active touch pointer IDs (window capture); shared with painting for single-finger pan/paint rules. */
  touchPointersRef: RefObject<Set<number>>;
}

/**
 * Two-finger pinch on the viewport element (or children): updates scale toward the pinch midpoint.
 * Uses window pointermove so both contacts are tracked even when one pointer captured the canvas.
 */
export function attachViewportPinchZoom(
  el: HTMLDivElement,
  setViewport: Dispatch<SetStateAction<ViewportState>>,
  getMinScale: () => number
): () => void {
  const pointers = new Map<number, { x: number; y: number }>();
  let prevSeparation = 0;

  const onPointerDown = (e: PointerEvent) => {
    if (!el.contains(e.target as Node)) {
      return;
    }
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) {
      const pts = [...pointers.values()];
      prevSeparation = Math.hypot(
        pts[0].x - pts[1].x,
        pts[0].y - pts[1].y
      );
    }
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!pointers.has(e.pointerId)) {
      return;
    }
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size !== 2) {
      return;
    }

    e.preventDefault();
    const pts = [...pointers.values()];
    const newSep = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
    if (prevSeparation <= 0 || newSep <= 0) {
      prevSeparation = newSep;
      return;
    }
    const ratio = newSep / prevSeparation;
    prevSeparation = newSep;

    const rect = el.getBoundingClientRect();
    const midX = (pts[0].x + pts[1].x) / 2 - rect.left;
    const midY = (pts[0].y + pts[1].y) / 2 - rect.top;
    const minScale = Math.max(1e-6, getMinScale());

    setViewport((v) => {
      const nextScale = Math.min(
        MAX_VIEWPORT_SCALE,
        Math.max(minScale, v.scale * ratio)
      );
      return zoomViewportTowardScreenPointSnapped(v, nextScale, midX, midY, {
        minScale,
        maxScale: MAX_VIEWPORT_SCALE,
      });
    });
  };

  const onPointerUp = (e: PointerEvent) => {
    if (!pointers.has(e.pointerId)) {
      return;
    }
    pointers.delete(e.pointerId);
    if (pointers.size < 2) {
      prevSeparation = 0;
    }
  };

  el.addEventListener("pointerdown", onPointerDown, true);
  window.addEventListener("pointermove", onPointerMove, { passive: false });
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("pointercancel", onPointerUp);

  return () => {
    el.removeEventListener("pointerdown", onPointerDown, true);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
    window.removeEventListener("pointercancel", onPointerUp);
  };
}

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
      const minScale = Math.max(1e-6, getMinScale());
      setViewport((v) => {
        const raw = {
          ...v,
          viewOffset: translateViewOffset(v.viewOffset, dx, dy),
        };
        return normalizeViewportToPixelGrid(raw, {
          minScale,
          maxScale: MAX_VIEWPORT_SCALE,
        });
      });
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
        MAX_VIEWPORT_SCALE,
        Math.max(minScale, v.scale * factor)
      );
      return zoomViewportTowardScreenPointSnapped(v, newScale, mx, my, {
        minScale,
        maxScale: MAX_VIEWPORT_SCALE,
      });
    });
  };

  el.addEventListener("wheel", onWheel, { passive: false });
  return () => el.removeEventListener("wheel", onWheel);
}

export function useViewportNavigation(options: UseViewportNavigationOptions) {
  const { touchPointersRef } = options;
  const getMinScaleRef = useRef(options.getMinScale);

  useLayoutEffect(() => {
    getMinScaleRef.current = options.getMinScale;
  }, [options.getMinScale]);

  const snapViewport = useCallback((v: ViewportState) => {
    const getter = getMinScaleRef.current;
    const minScale = Math.max(1e-6, getter?.() ?? 1);
    return normalizeViewportToPixelGrid(v, {
      minScale,
      maxScale: MAX_VIEWPORT_SCALE,
    });
  }, []);

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
      e.pointerType === "touch" &&
      touchPointersRef.current.size > 1
    ) {
      panRef.current.active = false;
    }

    if (
      !shouldStartPanGesture({
        pointerButton: e.button,
        spaceHeld: spaceDownRef.current,
        panMode: panModeRef.current,
      })
    ) {
      return;
    }
    if (e.pointerType === "touch" && touchPointersRef.current.size !== 1) {
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
  }, [touchPointersRef]);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!panRef.current.active || e.pointerId !== panRef.current.pointerId) {
      return;
    }
    if (e.pointerType === "touch" && touchPointersRef.current.size > 1) {
      return;
    }
    const dx = e.clientX - panRef.current.startClientX;
    const dy = e.clientY - panRef.current.startClientY;
    setViewport((v) =>
      snapViewport({
        ...v,
        viewOffset: {
          x: panRef.current.originOffsetX + dx,
          y: panRef.current.originOffsetY + dy,
        },
      })
    );
  }, [snapViewport, touchPointersRef]);

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
