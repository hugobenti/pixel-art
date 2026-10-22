/**
 * Purpose:
 * Attaches the canvas viewport's wheel (zoom / pan) and two-finger pinch listeners to the wrap element.
 *
 * Notes:
 * The gesture rules live in attachViewportWheel / attachViewportPinchZoom (useViewportNavigation.ts).
 */
"use client";

import { useLayoutEffect } from "react";

import {
  attachViewportPinchZoom,
  attachViewportWheel,
} from "@/features/editor/hooks/useViewportNavigation";
import type { IUseViewportWheelAndPinchParams } from "./useViewportWheelAndPinch.type";

export function useViewportWheelAndPinch({
  wrapRef,
  setViewport,
  minScaleRef,
  cssWidth,
  cssHeight,
  artworkWidth,
  artworkHeight,
}: IUseViewportWheelAndPinchParams) {
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) {
      return;
    }
    const cleanupWheel = attachViewportWheel(el, setViewport, () => minScaleRef.current);
    const cleanupPinch = attachViewportPinchZoom(el, setViewport, () => minScaleRef.current);
    return () => {
      cleanupWheel();
      cleanupPinch();
    };
  }, [wrapRef, setViewport, minScaleRef, cssWidth, cssHeight, artworkWidth, artworkHeight]);
}
