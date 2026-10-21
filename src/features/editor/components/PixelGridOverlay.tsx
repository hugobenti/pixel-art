/**
 * Purpose:
 * Top stacking canvas for the pixel grid; pointer events stay disabled so painting hits the artwork layer.
 */
"use client";
import type { IPixelGridOverlayProps } from "./PixelGridOverlay.type";

const canvasClass =
  "pointer-events-none absolute inset-0 block h-full w-full";

export function PixelGridOverlay({ canvasRef }: IPixelGridOverlayProps) {
  return <canvas ref={canvasRef} className={canvasClass} aria-hidden />;
}
