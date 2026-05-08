/**
 * Purpose:
 * Maintains the single source of truth for active touch pointer IDs during editor use (window, capture phase).
 *
 * Notes:
 * Call this hook in EditorWorkspace before useViewportNavigation and usePixelPainting so other hooks’
 * capture-phase listeners run after the Set is updated. Pan and paint read this ref; pinch-zoom uses
 * its own Map inside attachViewportPinchZoom.
 */
"use client";

import { useEffect, useRef } from "react";

export function useEditorPointerContacts() {
  const touchPointersRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "touch") {
        return;
      }
      touchPointersRef.current.add(e.pointerId);
    };

    const onPointerUpOrCancel = (e: PointerEvent) => {
      if (e.pointerType !== "touch") {
        return;
      }
      touchPointersRef.current.delete(e.pointerId);
    };

    window.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("pointerup", onPointerUpOrCancel, true);
    window.addEventListener("pointercancel", onPointerUpOrCancel, true);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("pointerup", onPointerUpOrCancel, true);
      window.removeEventListener("pointercancel", onPointerUpOrCancel, true);
    };
  }, []);

  return { touchPointersRef };
}
