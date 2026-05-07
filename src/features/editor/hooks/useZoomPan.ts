/**
 * Purpose:
 * Back-compat re-exports for viewport navigation (see useViewportNavigation.ts).
 */
"use client";

export {
  attachViewportWheel as attachWheelZoom,
  useViewportNavigation as useZoomPan,
} from "@/features/editor/hooks/useViewportNavigation";
