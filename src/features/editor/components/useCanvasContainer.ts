/**
 * Purpose:
 * CanvasContainer behavior: the artwork canvas suppresses the browser context menu so right-click paints
 * with the secondary color.
 */
"use client";

import type { MouseEvent } from "react";

export function useCanvasContainer() {
  return {
    preventContextMenu: (event: MouseEvent<HTMLCanvasElement>) => {
      event.preventDefault();
    },
  };
}
