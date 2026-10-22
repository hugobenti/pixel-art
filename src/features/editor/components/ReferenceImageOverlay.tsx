/**
 * Purpose:
 * Canvas overlay used to render the guide image above artwork and below the pixel grid.
 */
"use client";
import { referenceImageOverlay } from "./ReferenceImageOverlay.style";
import type { IReferenceImageOverlayProps } from "./ReferenceImageOverlay.type";

export function ReferenceImageOverlay({ canvasRef }: IReferenceImageOverlayProps) {
  return <canvas ref={canvasRef} className={referenceImageOverlay.canvas} aria-hidden />;
}
