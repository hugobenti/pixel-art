import type { RefObject } from "react";

export interface IUseViewportNavigationOptions {
  /** Minimum scale from contain-fit ratio; used when snapping zoom/pan to integer pixels. */
  getMinScale?: () => number;
  /** Active touch pointer IDs (window capture); shared with painting for single-finger pan/paint rules. */
  touchPointersRef: RefObject<Set<number>>;
}
