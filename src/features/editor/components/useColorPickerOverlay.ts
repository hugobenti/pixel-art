/**
 * Purpose:
 * ColorPickerOverlay view model: where the picked-pixel outline, the loupe and the "Release to cancel"
 * pill go for the current pick hold, and the loupe's cell and ring colors.
 */
"use client";

import type { CSSProperties } from "react";

import {
  LOUPE_GAP_MOUSE_PX,
  LOUPE_GAP_TOUCH_PX,
  LOUPE_SIZE_PX,
  loupeCells,
  loupePlacement,
} from "@/features/editor/logic/colorPicker";
import type { IColorPickerOverlayProps, ILoupeView } from "./ColorPickerOverlay.type";

/** The pill sits just below-right of the pointer, like a tooltip. */
const PILL_OFFSET_PX = 16;

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

  if (target.kind === "offCanvas") {
    const pill: CSSProperties = { left: clientX + PILL_OFFSET_PX, top: clientY + PILL_OFFSET_PX };
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

  const position = loupePlacement({
    pointerX: clientX,
    pointerY: clientY,
    size: LOUPE_SIZE_PX,
    gap: hold.pointerType === "touch" ? LOUPE_GAP_TOUCH_PX : LOUPE_GAP_MOUSE_PX,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
  });
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
