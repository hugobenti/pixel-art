/**
 * Purpose:
 * Pointer-driven painting with window-level drag tracking and stroke delta recording.
 *
 * Notes:
 * Touch contacts are counted only via touchPointersRef (useEditorPointerContacts). When a second touch
 * lands, the stroke ends immediately. Draw permission is represented by painting + activePaintingPointerId:
 * no active stroke until pointer down with a valid gesture; cleared on up/cancel or multi-touch.
 * Painting on a hidden active layer is ignored; parent may toast via `onHiddenActiveLayerPaintAttempt`.
 */
"use client";

import type { RefObject } from "react";
import { useEffect, useRef } from "react";

import { screenToWorldCoordinates } from "@/features/editor/logic/coordinateMath";
import { mergeStrokeDeltas } from "@/features/editor/logic/mergeStrokeDeltas";
import type {
  Artwork,
  HistoryCommand,
  PixelDelta,
  ViewportState,
} from "@/features/editor/types/editor.types";

import type { ColorSlot } from "@/features/editor/logic/paletteMutations";

interface UsePixelPaintingParams {
  artwork: Artwork;
  activeLayerId: string | null;
  /** When false and `activeLayerId` is set, paint gestures are ignored (layer hidden in UI). */
  activeLayerVisible: boolean;
  activeLayerPixelData: Uint8Array | null;
  viewport: ViewportState;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  activeSlot: ColorSlot;
  primaryPaletteIndex: number;
  secondaryPaletteIndex: number;
  onCommitStroke: (cmd: HistoryCommand) => void;
  onPixelsChanged: () => void;
  /** When true, primary-button painting is skipped (Space pan / pan mode). */
  deferPrimaryPaint?: () => boolean;
  /** Shared touch Set from useEditorPointerContacts; hook order must place contacts before painting. */
  touchPointersRef: RefObject<Set<number>>;
  /** Fires when the user tries to paint while the active layer is hidden. */
  onHiddenActiveLayerPaintAttempt?: () => void;
}

/**
 * Main button / touch uses the active slot; right button paints the opposite slot (desktop).
 */
function paletteIndexForButtons(
  buttons: number,
  activeSlot: ColorSlot,
  primary: number,
  secondary: number
) {
  if (buttons === 2) {
    return activeSlot === "primary" ? secondary : primary;
  }
  return activeSlot === "primary" ? primary : secondary;
}

export function usePixelPainting({
  artwork,
  activeLayerId,
  activeLayerVisible,
  activeLayerPixelData,
  viewport,
  canvasRef,
  activeSlot,
  primaryPaletteIndex,
  secondaryPaletteIndex,
  onCommitStroke,
  onPixelsChanged,
  deferPrimaryPaint,
  touchPointersRef,
  onHiddenActiveLayerPaintAttempt,
}: UsePixelPaintingParams) {
  const artworkRef = useRef(artwork);
  const activeLayerIdRef = useRef(activeLayerId);
  const activeLayerVisibleRef = useRef(activeLayerVisible);
  const activeLayerPixelDataRef = useRef(activeLayerPixelData);
  const viewportRef = useRef(viewport);

  useEffect(() => {
    artworkRef.current = artwork;
    activeLayerIdRef.current = activeLayerId;
    activeLayerVisibleRef.current = activeLayerVisible;
    activeLayerPixelDataRef.current = activeLayerPixelData;
    viewportRef.current = viewport;
  }, [artwork, activeLayerId, activeLayerVisible, activeLayerPixelData, viewport]);

  const strokeRaw = useRef<PixelDelta[]>([]);
  /** True while a paint stroke is active for the captured pointer (draw permission). */
  const painting = useRef(false);
  const activePaintingPointerId = useRef<number | null>(null);
  const activeSlotRef = useRef(activeSlot);

  useEffect(() => {
    activeSlotRef.current = activeSlot;
  }, [activeSlot]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!painting.current) {
        return;
      }
      if (e.pointerId !== activePaintingPointerId.current) {
        return;
      }
      const canvas = canvasRef.current;
      const art = artworkRef.current;
      const layerId = activeLayerIdRef.current;
      const pixelData = activeLayerPixelDataRef.current;
      if (!canvas) {
        return;
      }
      if (!layerId || !pixelData || !activeLayerVisibleRef.current) {
        return;
      }
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const { x, y } = screenToWorldCoordinates(
        mx,
        my,
        viewportRef.current
      );
      const pi = paletteIndexForButtons(
        e.buttons,
        activeSlotRef.current,
        primaryPaletteIndex,
        secondaryPaletteIndex
      );
      if (x < 0 || y < 0 || x >= art.width || y >= art.height) {
        return;
      }
      const index = x + y * art.width;
      const prev = pixelData[index];
      if (prev === pi) {
        return;
      }
      pixelData[index] = pi;
      strokeRaw.current.push({
        layerId,
        index,
        previousPaletteIndex: prev,
        newPaletteIndex: pi,
      });
      onPixelsChanged();
    };

    const endStroke = () => {
      if (!painting.current) {
        return;
      }
      painting.current = false;
      activePaintingPointerId.current = null;
      const merged = mergeStrokeDeltas(strokeRaw.current);
      strokeRaw.current = [];
      if (merged.length > 0) {
        onCommitStroke({ deltas: merged });
      }
    };

    /** Runs after useEditorPointerContacts capture handler so the Set already includes this pointer. */
    const onTouchPointerDownEndStrokeIfMulti = (e: PointerEvent) => {
      if (e.pointerType !== "touch") {
        return;
      }
      if (touchPointersRef.current.size > 1 && painting.current) {
        endStroke();
      }
    };

    const onPointerFinish = (e: PointerEvent) => {
      if (e.pointerId !== activePaintingPointerId.current) {
        return;
      }
      endStroke();
    };

    window.addEventListener("pointerdown", onTouchPointerDownEndStrokeIfMulti, true);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onPointerFinish);
    window.addEventListener("pointercancel", onPointerFinish);
    return () => {
      window.removeEventListener(
        "pointerdown",
        onTouchPointerDownEndStrokeIfMulti,
        true
      );
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onPointerFinish);
      window.removeEventListener("pointercancel", onPointerFinish);
    };
  }, [
    canvasRef,
    primaryPaletteIndex,
    secondaryPaletteIndex,
    onCommitStroke,
    onPixelsChanged,
    touchPointersRef,
  ]);

  const onArtworkPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.button !== 0 && e.button !== 2) {
      return;
    }
    if (e.button === 0 && deferPrimaryPaint?.()) {
      return;
    }
    if (e.pointerType === "touch" && touchPointersRef.current.size > 1) {
      e.preventDefault();
      return;
    }

    if (
      activePaintingPointerId.current !== null &&
      activePaintingPointerId.current !== e.pointerId
    ) {
      e.preventDefault();
      return;
    }

    e.preventDefault();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    const canvas = canvasRef.current;
    const art = artworkRef.current;
    const layerId = activeLayerIdRef.current;
    const pixelData = activeLayerPixelDataRef.current;
    if (!canvas) {
      return;
    }
    if (!layerId || !pixelData) {
      return;
    }
    if (!activeLayerVisibleRef.current) {
      onHiddenActiveLayerPaintAttempt?.();
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const { x, y } = screenToWorldCoordinates(mx, my, viewportRef.current);
    const pi = paletteIndexForButtons(
      e.buttons,
      activeSlotRef.current,
      primaryPaletteIndex,
      secondaryPaletteIndex
    );
    activePaintingPointerId.current = e.pointerId;
    painting.current = true;
    strokeRaw.current = [];
    if (x >= 0 && y >= 0 && x < art.width && y < art.height) {
      const index = x + y * art.width;
      const prev = pixelData[index];
      if (prev !== pi) {
        pixelData[index] = pi;
        strokeRaw.current.push({
          layerId,
          index,
          previousPaletteIndex: prev,
          newPaletteIndex: pi,
        });
        onPixelsChanged();
      }
    }
  };

  return { onArtworkPointerDown };
}
