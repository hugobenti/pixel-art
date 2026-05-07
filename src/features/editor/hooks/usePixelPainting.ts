/**
 * Purpose:
 * Pointer-driven painting with window-level drag tracking and stroke delta recording.
 *
 * Notes:
 * A second pointer on the canvas ends the current stroke so pinch-zoom can run without corrupting paint data.
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
  const activeSlotRef = useRef(activeSlot);
  const endStrokeRef = useRef<() => void>(() => {});
  const activePointersOnCanvas = useRef(new Set<number>());

  useEffect(() => {
    activeSlotRef.current = activeSlot;
  }, [activeSlot]);

  useEffect(() => {
    const removePointer = (e: PointerEvent) => {
      activePointersOnCanvas.current.delete(e.pointerId);
    };
    window.addEventListener("pointerup", removePointer);
    window.addEventListener("pointercancel", removePointer);
    return () => {
      window.removeEventListener("pointerup", removePointer);
      window.removeEventListener("pointercancel", removePointer);
    };
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!painting.current) {
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
      const merged = mergeStrokeDeltas(strokeRaw.current);
      strokeRaw.current = [];
      if (merged.length > 0) {
        onCommitStroke({ deltas: merged });
      }
    };

    endStrokeRef.current = endStroke;

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", endStroke);
    window.addEventListener("pointercancel", endStroke);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", endStroke);
      window.removeEventListener("pointercancel", endStroke);
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

    activePointersOnCanvas.current.add(e.pointerId);
    if (activePointersOnCanvas.current.size > 1) {
      endStrokeRef.current();
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
