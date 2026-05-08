/**
 * Purpose:
 * Canvas overlay used to render the guide image above artwork and below the pixel grid.
 */
"use client";

import type { RefObject } from "react";

const canvasClass =
  "pointer-events-none absolute inset-0 block h-full w-full";

interface ReferenceImageOverlayProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
}

export function ReferenceImageOverlay({ canvasRef }: ReferenceImageOverlayProps) {
  return <canvas ref={canvasRef} className={canvasClass} aria-hidden />;
}
