/**
 * Purpose:
 * ColorSelectionRow view model: which swatch carries the roving focus outline, kept inside the palette,
 * and keeping that swatch scrolled into view (the color picker moves it while you drag).
 */
"use client";

import { useEffect, useRef } from "react";

import { clampPaletteIndex } from "@/features/editor/logic/paletteMutations";
import { scrollLeftToReveal } from "@/features/editor/logic/scrollReveal";
import type { IColorSelectionRowProps } from "./ColorSelectionRow.type";

/** Room kept between the focused swatch and the scroller edge: its 4px ring plus breathing space. */
const REVEAL_PADDING_PX = 8;

export function useColorSelectionRow({ palette, focusedSwatchIndex }: IColorSelectionRowProps) {
  const focusedIndex = clampPaletteIndex(focusedSwatchIndex, palette.length);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const item = scroller?.querySelectorAll("li")[focusedIndex];
    if (!scroller || !item) {
      return;
    }
    const scrollerLeft = scroller.getBoundingClientRect().left;
    const itemRect = item.getBoundingClientRect();
    const next = scrollLeftToReveal({
      itemStart: itemRect.left - scrollerLeft + scroller.scrollLeft,
      itemEnd: itemRect.right - scrollerLeft + scroller.scrollLeft,
      scrollLeft: scroller.scrollLeft,
      viewWidth: scroller.clientWidth,
      padding: REVEAL_PADDING_PX,
    });
    if (next !== null) {
      scroller.scrollLeft = next;
    }
  }, [focusedIndex]);

  return { focusedIndex, scrollerRef };
}
