/**
 * Purpose:
 * ColorPickerOverlay view model: where the picked-pixel outline, the loupe and the "Release to cancel"
 * pill go for the current pick hold, and the loupe's cell and ring colors.
 */
"use client";

import type { CSSProperties } from "react";

import {
  floatingPlacement,
  LOUPE_GAP_MOUSE_PX,
  LOUPE_GAP_TOUCH_PX,
  LOUPE_SIZE_PX,
  loupeCells,
} from "@/features/editor/logic/colorPicker";
import type { IColorPickerOverlayProps, ILoupeView } from "./ColorPickerOverlay.type";

/** Upper bound of the "Release to cancel" pill (text-xs, px-2.5 py-1, 1px border), so it stays on screen. */
const PILL_WIDTH_PX = 132;
const PILL_HEIGHT_PX = 26;

export function useColorPickerOverlay({
  hold,
  artwork,
  viewport,
  primaryColor,
  secondaryColor,
}: IColorPickerOverlayProps) {
  if (!hold) {
    return { outline: null, loupe: null, pill: null };
  }
  const { target, clientX, clientY } = hold;
  // The pill and the loupe float the same way: beside the pointer, clear of a finger on touch.
  const float = {
    pointerX: clientX,
    pointerY: clientY,
    gap: hold.pointerType === "touch" ? LOUPE_GAP_TOUCH_PX : LOUPE_GAP_MOUSE_PX,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
  };

  if (target.kind === "offCanvas") {
    const pill: CSSProperties = floatingPlacement({ ...float, width: PILL_WIDTH_PX, height: PILL_HEIGHT_PX });
    return { outline: null, loupe: null, pill };
  }

  const { scale, viewOffset } = viewport;
  const inArtwork = target.kind === "color" || target.inArtwork;
  const outline: CSSProperties | null = inArtwork
    ? {
        left: hold.canvasLeft + viewOffset.x + scale * target.x,
        top: hold.canvasTop + viewOffset.y + scale * target.y,
        width: scale,
        height: scale,
      }
    : null;

  const position = floatingPlacement({ ...float, width: LOUPE_SIZE_PX, height: LOUPE_SIZE_PX });
  const picked = target.kind === "color" ? artwork.palette[target.paletteIndex] : null;
  const loupe: ILoupeView = {
    style: { ...position, width: LOUPE_SIZE_PX, height: LOUPE_SIZE_PX },
    cells: loupeCells(artwork, target.x, target.y).map((color, key) =>
      color === null ? { key } : { key, style: { backgroundColor: color } },
    ),
    ringTopStyle: picked ? { backgroundColor: picked } : undefined,
    ringTopEmpty: picked === null,
    ringBottomStyle: { backgroundColor: hold.slot === "primary" ? primaryColor : secondaryColor },
  };

  return { outline, loupe, pill: null };
}
