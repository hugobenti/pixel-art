/**
 * Purpose:
 * Arrow keys pan the canvas while the viewport element itself has focus (keyboard alternative to drag pan).
 */
"use client";

import { useEffect, type Dispatch, type RefObject, type SetStateAction } from "react";

import type { IViewportState } from "@/features/editor/types/editor.type";

import { keyboardPanDelta } from "@/features/editor/logic/keyboardPan";
import { translateViewOffset } from "@/features/editor/services/viewportNavigationService";

export function useViewportKeyboardPan(
  wrapRef: RefObject<HTMLDivElement | null>,
  setViewport: Dispatch<SetStateAction<IViewportState>>,
) {
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target !== el || event.altKey || event.ctrlKey || event.metaKey) {
        return;
      }
      const delta = keyboardPanDelta(event.key, event.shiftKey);
      if (!delta) {
        return;
      }
      event.preventDefault();
      setViewport((v) => ({
        ...v,
        viewOffset: translateViewOffset(v.viewOffset, delta.dx, delta.dy),
      }));
    };
    el.addEventListener("keydown", onKeyDown);
    return () => el.removeEventListener("keydown", onKeyDown);
  }, [wrapRef, setViewport]);
}
