/**
 * Purpose:
 * Entry/exit motion timer state and close handler for the layers drawer panel.
 */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ANIMATION_MS } from "@/features/editor/components/LayersDrawer/layersDrawer.constants";
import type { IUseLayersDrawerPanelParams } from "./useLayersDrawerPanel.type";

export function useLayersDrawerPanel({ onClose }: IUseLayersDrawerPanelParams) {
  const [panelEntered, setPanelEntered] = useState(false);
  const openEnterTimerRef = useRef<number | null>(null);
  const closeExitTimerRef = useRef<number | null>(null);

  useEffect(() => {
    openEnterTimerRef.current = window.setTimeout(() => {
      openEnterTimerRef.current = null;
      setPanelEntered(true);
    }, 16);
    return () => {
      if (openEnterTimerRef.current !== null) {
        window.clearTimeout(openEnterTimerRef.current);
        openEnterTimerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (closeExitTimerRef.current !== null) {
        window.clearTimeout(closeExitTimerRef.current);
      }
    };
  }, []);

  const handleClose = useCallback(() => {
    if (openEnterTimerRef.current !== null) {
      window.clearTimeout(openEnterTimerRef.current);
      openEnterTimerRef.current = null;
    }
    setPanelEntered(false);
    if (closeExitTimerRef.current !== null) {
      window.clearTimeout(closeExitTimerRef.current);
    }
    closeExitTimerRef.current = window.setTimeout(() => {
      closeExitTimerRef.current = null;
      onClose();
    }, ANIMATION_MS);
  }, [onClose]);

  return { panelEntered, handleClose };
}
