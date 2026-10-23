/**
 * Purpose:
 * Pure rules for the color picker: what the pointer targets, the loupe's magnified cells and where the
 * loupe sits, which slot a pick fills, and when a press starts a pick hold.
 *
 * Notes:
 * A pick reads the composite of visible layers (what the artist sees), so hidden layers are skipped and
 * transparent pixels let the layer below show through. DOM-free so it runs under Vitest's node environment.
 */

import type { IViewportState } from "@/features/editor/types/editor.type";
import { screenToWorldCoordinates } from "./coordinateMath";
import type { TColorSlot } from "./paletteMutations.type";
import { compositeOpaquePaletteIndexAt } from "./visibleCompositePixelCounts";
import type {
  IEscapeDisarmInput,
  IFloatingPlacementInput,
  IPickHoldStartInput,
  TPickArtwork,
  TPickTarget,
} from "./colorPicker.type";

/** Cells on each side of the target in the loupe: 2 gives a 5 × 5 block. */
export const LOUPE_RADIUS_CELLS = 2;
export const LOUPE_CELL_PX = 18;
export const LOUPE_RING_PX = 12;
/** Loupe diameter, ring included. */
export const LOUPE_SIZE_PX = (LOUPE_RADIUS_CELLS * 2 + 1) * LOUPE_CELL_PX + LOUPE_RING_PX * 2;
export const LOUPE_GAP_MOUSE_PX = 16;
/** Larger on touch so the finger never covers the loupe. */
export const LOUPE_GAP_TOUCH_PX = 48;

const MAIN_BUTTON = 0;
const RIGHT_BUTTON = 2;

/**
 * The pick target for a point in canvas CSS pixels, or off the canvas when `canvasPoint` is null.
 */
export function pickTargetAt(
  artwork: TPickArtwork,
  viewport: IViewportState,
  canvasPoint: { x: number; y: number } | null,
): TPickTarget {
  if (!canvasPoint) {
    return { kind: "offCanvas" };
  }
  const { x, y } = screenToWorldCoordinates(canvasPoint.x, canvasPoint.y, viewport);
  const paletteIndex = compositeOpaquePaletteIndexAt(artwork, x, y);
  if (paletteIndex !== null) {
    return { kind: "color", x, y, paletteIndex };
  }
  const inArtwork = x >= 0 && y >= 0 && x < artwork.width && y < artwork.height;
  return { kind: "empty", x, y, inArtwork };
}

/** The loupe's cells around (x, y), row by row: palette hex, or null where there is nothing to see. */
export function loupeCells(artwork: TPickArtwork, x: number, y: number): (string | null)[] {
  const cells: (string | null)[] = [];
  for (let dy = -LOUPE_RADIUS_CELLS; dy <= LOUPE_RADIUS_CELLS; dy++) {
    for (let dx = -LOUPE_RADIUS_CELLS; dx <= LOUPE_RADIUS_CELLS; dx++) {
      const index = compositeOpaquePaletteIndexAt(artwork, x + dx, y + dy);
      cells.push(index === null ? null : artwork.palette[index]);
    }
  }
  return cells;
}

/** The slot a pick fills: the active one, or the other with the right button (as painting does). */
export function pickSlotForButton(button: number, activeSlot: TColorSlot): TColorSlot {
  if (button !== RIGHT_BUTTON) {
    return activeSlot;
  }
  return activeSlot === "primary" ? "secondary" : "primary";
}

/** Whether a press on the canvas starts a pick hold instead of painting or panning. */
export function shouldStartPickHold({
  armed,
  altKey,
  button,
  pointerType,
  touchCount,
  panDeferred,
}: IPickHoldStartInput): boolean {
  if (!armed && !altKey) {
    return false;
  }
  if (button !== MAIN_BUTTON && button !== RIGHT_BUTTON) {
    return false;
  }
  if (button === MAIN_BUTTON && panDeferred) {
    return false;
  }
  return pointerType !== "touch" || touchCount === 1;
}

/** Escape turns the picker off only when nothing else (a panel, a text field, another handler) owns it. */
export function shouldEscapeDisarmPicker({
  key,
  defaultPrevented,
  textEntry,
  panelOpen,
}: IEscapeDisarmInput): boolean {
  return key === "Escape" && !defaultPrevented && !textEntry && !panelOpen;
}

/**
 * Top-left in viewport pixels of a box floating next to the pointer: above and to the right, flipping
 * each axis when the box would leave the viewport, and kept inside it when neither side fits.
 */
export function floatingPlacement({
  pointerX,
  pointerY,
  width,
  height,
  gap,
  viewportWidth,
  viewportHeight,
}: IFloatingPlacementInput): { left: number; top: number } {
  const right = pointerX + gap;
  const left = right + width <= viewportWidth ? right : pointerX - gap - width;
  const above = pointerY - gap - height;
  const top = above >= 0 ? above : pointerY + gap;
  return {
    left: Math.max(0, Math.min(left, viewportWidth - width)),
    top: Math.max(0, Math.min(top, viewportHeight - height)),
  };
}
