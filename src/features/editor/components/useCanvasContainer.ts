/**
 * Purpose:
 * View model for CanvasContainer: artwork canvas event handlers that are not painting.
 */

import type { MouseEvent } from "react";

/** Suppresses the browser context menu so right-click can paint with the secondary color. */
function preventArtworkContextMenu(event: MouseEvent<HTMLCanvasElement>) {
  event.preventDefault();
}

export function useCanvasContainer() {
  return { onArtworkContextMenu: preventArtworkContextMenu };
}
