/**
 * Purpose:
 * Minimum zoom scale allowed in the editor: a fixed fraction of the contain-fit scale.
 */

import { computeContainFit } from "@/features/editor/logic/viewportFit";

export const MIN_ZOOM_RATIO_OF_CONTAIN = 0.75;

export function computeViewportMinScale(
  containerW: number,
  containerH: number,
  worldW: number,
  worldH: number,
): number {
  return (
    computeContainFit(containerW, containerH, worldW, worldH).scale * MIN_ZOOM_RATIO_OF_CONTAIN
  );
}
