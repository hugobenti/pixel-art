import type { Dispatch, RefObject, SetStateAction } from "react";

import type { IViewportState } from "@/features/editor/types/editor.type";

export interface IUseContainFitViewportParams {
  /** Viewport box in CSS pixels (from useCanvasEngine). */
  cssWidth: number;
  cssHeight: number;
  artworkWidth: number;
  artworkHeight: number;
  setViewport: Dispatch<SetStateAction<IViewportState>>;
  /** Zoom-out limit read by wheel, pinch, pan and toolbar zoom; updated with each fit. */
  minScaleRef: RefObject<number>;
}
