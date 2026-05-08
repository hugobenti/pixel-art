/**
 * Purpose:
 * Back-compat re-exports for viewport navigation (see useViewportNavigation.ts).
 *
 * Notes:
 * useZoomPan requires touchPointersRef from useEditorPointerContacts — same contract as useViewportNavigation.
 */
"use client";

export type { UseViewportNavigationOptions } from "@/features/editor/hooks/useViewportNavigation";
export {
  attachViewportWheel as attachWheelZoom,
  useViewportNavigation as useZoomPan,
} from "@/features/editor/hooks/useViewportNavigation";
