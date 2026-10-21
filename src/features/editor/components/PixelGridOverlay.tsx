/**
 * Purpose:
 * Top stacking canvas for the pixel grid; pointer events stay disabled so painting hits the artwork layer.
 */
"use client";

import type { RefObject } from "react";

import { pixelGridOverlay } from "@/features/editor/components/PixelGridOverlay.style";

interface PixelGridOverlayProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
}

export function PixelGridOverlay({ canvasRef }: PixelGridOverlayProps) {
  return (
    <canvas ref={canvasRef} className={pixelGridOverlay.canvas} aria-hidden />
  );
}
