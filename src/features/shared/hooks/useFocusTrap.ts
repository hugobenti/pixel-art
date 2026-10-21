/**
 * Purpose:
 * Dialog focus handling: moves focus into the container when it activates, keeps Tab inside it,
 * and restores focus to the previously focused element when it deactivates.
 *
 * Notes:
 * Traps stack: only the most recently activated container handles Tab, so a modal opened from a
 * drawer owns focus until it closes.
 */
"use client";

import { useEffect, type RefObject } from "react";

import { FOCUSABLE_SELECTOR, focusTrapTargetIndex } from "@/features/shared/logic/focusTrap";

const activeTraps: HTMLElement[] = [];

export function useFocusTrap(containerRef: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    const container = containerRef.current;
    if (!active || !container) {
      return;
    }
    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    activeTraps.push(container);

    const focusables = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

    if (!container.contains(document.activeElement)) {
      (focusables()[0] ?? container).focus();
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || activeTraps[activeTraps.length - 1] !== container) {
        return;
      }
      const items = focusables();
      const current =
        document.activeElement instanceof HTMLElement ? items.indexOf(document.activeElement) : -1;
      const target = focusTrapTargetIndex(current, items.length, event.shiftKey);
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      if (target !== null) {
        event.preventDefault();
        items[target].focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      activeTraps.splice(activeTraps.indexOf(container), 1);
      if (previouslyFocused?.isConnected) {
        previouslyFocused.focus();
      }
    };
  }, [containerRef, active]);
}
