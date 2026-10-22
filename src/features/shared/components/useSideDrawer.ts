/**
 * Purpose:
 * SideDrawer behavior: title id for aria-labelledby, focus trap on the shell, and the slide/fade timing style.
 */
"use client";

import { useId, useMemo, useRef } from "react";

import { useFocusTrap } from "@/features/shared/hooks/useFocusTrap";

export function useSideDrawer(motionDurationMs: number) {
  const titleId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  useFocusTrap(rootRef, true);

  const motionStyle = useMemo(
    () => ({ transitionDuration: `${motionDurationMs}ms` }),
    [motionDurationMs],
  );

  return { titleId, rootRef, motionStyle };
}
