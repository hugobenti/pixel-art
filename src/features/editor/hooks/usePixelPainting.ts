/**
 * Purpose:
 * Pointer-driven painting with window-level drag tracking and stroke delta recording.
 *
 * Notes:
 * Painting is locked to the first active pointer until release, preventing multi-touch
 * drawing from secondary contacts while keeping pointer tracking on the window.
 */
"use client";

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
  viewport: ViewportState;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  activeSlot: ColorSlot;
  primaryPaletteIndex: number;
  secondaryPaletteIndex: number;
  onCommitStroke: (cmd: HistoryCommand) => void;
  onPixelsChanged: () => void;
  /** When true, primary-button painting is skipped (Space pan / pan mode). */
  deferPrimaryPaint?: () => boolean;
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
  viewport,
  canvasRef,
  activeSlot,
  primaryPaletteIndex,
  secondaryPaletteIndex,
  onCommitStroke,
  onPixelsChanged,
  deferPrimaryPaint,
}: UsePixelPaintingParams) {
  const artworkRef = useRef(artwork);
  const viewportRef = useRef(viewport);

  useEffect(() => {
    artworkRef.current = artwork;
    viewportRef.current = viewport;
  }, [artwork, viewport]);

  const strokeRaw = useRef<PixelDelta[]>([]);
  const painting = useRef(false);
  const activePaintingPointerId = useRef<number | null>(null);
  const activeSlotRef = useRef(activeSlot);
  const endStrokeRef = useRef<() => void>(() => {});

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
      if (!canvas) {
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
      const prev = art.pixelData[index];
      if (prev === pi) {
        return;
      }
      art.pixelData[index] = pi;
      strokeRaw.current.push({
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

    const onPointerFinish = (e: PointerEvent) => {
      if (e.pointerId !== activePaintingPointerId.current) {
        return;
      }
      endStroke();
    };

    endStrokeRef.current = endStroke;

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onPointerFinish);
    window.addEventListener("pointercancel", onPointerFinish);
    return () => {
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
  ]);

  const onArtworkPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.button !== 0 && e.button !== 2) {
      return;
    }
    if (e.button === 0 && deferPrimaryPaint?.()) {
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
    if (!canvas) {
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
      const prev = art.pixelData[index];
      if (prev !== pi) {
        art.pixelData[index] = pi;
        strokeRaw.current.push({
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
