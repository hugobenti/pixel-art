/**
 * Purpose:
 * Canvas overlay used to render the guide image above artwork and below the pixel grid.
 */
"use client";

import type { RefObject } from "react";

import { referenceImageOverlay } from "@/features/editor/components/ReferenceImageOverlay.style";

interface ReferenceImageOverlayProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
}

export function ReferenceImageOverlay({ canvasRef }: ReferenceImageOverlayProps) {
  return (
    <canvas
      ref={canvasRef}
      className={referenceImageOverlay.canvas}
      aria-hidden
    />
  );
}
