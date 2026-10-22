import type { Dispatch, RefObject, SetStateAction } from "react";

import type { IViewportState } from "@/features/editor/types/editor.type";

export interface IUseViewportWheelAndPinchParams {
  wrapRef: RefObject<HTMLDivElement | null>;
  setViewport: Dispatch<SetStateAction<IViewportState>>;
  /** Zoom-out limit kept current by useContainFitViewport. */
  minScaleRef: RefObject<number>;
  /** Viewport box and artwork size: the listeners re-attach (and drop any pinch in progress) when they change. */
  cssWidth: number;
  cssHeight: number;
  artworkWidth: number;
  artworkHeight: number;
}
