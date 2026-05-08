/**
 * Purpose:
 * Entry/exit motion timer state and close handler for the layers drawer panel.
 */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ANIMATION_MS } from "@/features/editor/components/LayersDrawer/layersDrawer.constants";

interface UseLayersDrawerPanelParams {
  onClose: () => void;
}

export function useLayersDrawerPanel({ onClose }: UseLayersDrawerPanelParams) {
  const [panelEntered, setPanelEntered] = useState(false);
  type TimeoutHandle = ReturnType<typeof globalThis.setTimeout>;
  const openEnterTimerRef = useRef<TimeoutHandle | null>(null);
  const closeExitTimerRef = useRef<TimeoutHandle | null>(null);

  useEffect(() => {
    openEnterTimerRef.current = globalThis.setTimeout(() => {
      openEnterTimerRef.current = null;
      setPanelEntered(true);
    }, 16);
    return () => {
      if (openEnterTimerRef.current !== null) {
        globalThis.clearTimeout(openEnterTimerRef.current);
        openEnterTimerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (closeExitTimerRef.current !== null) {
        globalThis.clearTimeout(closeExitTimerRef.current);
      }
    };
  }, []);

  const handleClose = useCallback(() => {
    if (openEnterTimerRef.current !== null) {
      globalThis.clearTimeout(openEnterTimerRef.current);
      openEnterTimerRef.current = null;
    }
    setPanelEntered(false);
    if (closeExitTimerRef.current !== null) {
      globalThis.clearTimeout(closeExitTimerRef.current);
    }
    closeExitTimerRef.current = globalThis.setTimeout(() => {
      closeExitTimerRef.current = null;
      onClose();
    }, ANIMATION_MS);
  }, [onClose]);

  return { panelEntered, handleClose };
}
