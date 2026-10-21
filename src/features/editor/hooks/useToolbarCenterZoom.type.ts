import type { RefObject } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { IViewportState } from "@/features/editor/types/editor.type";

export interface IUseToolbarCenterZoomParams {
  wrapRef: RefObject<HTMLDivElement | null>;
  setViewport: Dispatch<SetStateAction<IViewportState>>;
  minScaleRef: RefObject<number>;
  /** Minimum scale from contain-fit; drives zoom-out limit without reading refs during render. */
  viewportMinScale: number;
  viewportScale: number;
}
