/**
 * Purpose:
 * Canvas overlay used to render the guide image above artwork and below the pixel grid.
 */
"use client";
import type { IReferenceImageOverlayProps } from "./ReferenceImageOverlay.type";

const canvasClass =
  "pointer-events-none absolute inset-0 block h-full w-full";

export function ReferenceImageOverlay({ canvasRef }: IReferenceImageOverlayProps) {
  return <canvas ref={canvasRef} className={canvasClass} aria-hidden />;
}
