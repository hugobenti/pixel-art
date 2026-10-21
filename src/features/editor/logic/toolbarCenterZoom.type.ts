import type { INormalizeViewportOptions } from "@/features/editor/logic/viewportPixelAlign.type";

export interface IToolbarCenterZoomContext {
  wrapEl: HTMLElement;
  minScale: number;
  normalizeOpts: INormalizeViewportOptions;
}
