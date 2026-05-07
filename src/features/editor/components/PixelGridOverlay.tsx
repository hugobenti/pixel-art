/**
 * Purpose:
 * Top stacking canvas for the pixel grid; pointer events stay disabled so painting hits the artwork layer.
 */
"use client";

import type { RefObject } from "react";

const canvasClass =
  "pointer-events-none absolute inset-0 block h-full w-full";

interface PixelGridOverlayProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
}

export function PixelGridOverlay({ canvasRef }: PixelGridOverlayProps) {
  return <canvas ref={canvasRef} className={canvasClass} aria-hidden />;
}
