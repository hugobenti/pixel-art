/**
 * Purpose:
 * Transition style shared by the SideDrawer backdrop and panel.
 */

import type { CSSProperties } from "react";

export function useSideDrawer(motionDurationMs: number) {
  const motionStyle: CSSProperties = {
    transitionDuration: `${motionDurationMs}ms`,
  };
  return { motionStyle };
}
