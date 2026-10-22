/**
 * Purpose:
 * Top stacking canvas for the pixel grid; pointer events stay disabled so painting hits the artwork layer.
 */
"use client";
import { pixelGridOverlay } from "./PixelGridOverlay.style";
import type { IPixelGridOverlayProps } from "./PixelGridOverlay.type";

export function PixelGridOverlay({ canvasRef }: IPixelGridOverlayProps) {
  return <canvas ref={canvasRef} className={pixelGridOverlay.canvas} aria-hidden />;
}
