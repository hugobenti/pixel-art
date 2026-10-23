/**
 * Purpose:
 * What the color picker shows while a pick is held: an outline on the pixel under the pointer, a round
 * loupe magnifying the pixels around it with a split ring (top: the color you would pick, bottom: the
 * color it replaces), and "Release to cancel" when the pointer leaves the canvas.
 *
 * Notes:
 * A fixed full-window layer, so the loupe can draw over the toolbar and palette row. It never takes
 * pointer events and is hidden from assistive technology.
 */
"use client";

import { editor } from "@/content/editor";
import { cx } from "@/features/shared/utils/cx";
import { colorPickerOverlay } from "./ColorPickerOverlay.style";
import type { IColorPickerOverlayProps } from "./ColorPickerOverlay.type";
import { useColorPickerOverlay } from "./useColorPickerOverlay";

export function ColorPickerOverlay(props: IColorPickerOverlayProps) {
  const { outline, loupe, pill } = useColorPickerOverlay(props);

  if (!outline && !loupe && !pill) {
    return null;
  }

  return (
    <div className={colorPickerOverlay.layer} aria-hidden>
      {outline ? <div className={colorPickerOverlay.outline} style={outline} /> : null}
      {loupe ? (
        <div className={colorPickerOverlay.loupe} style={loupe.style}>
          <div
            className={cx(colorPickerOverlay.ringTop, loupe.ringTopEmpty && colorPickerOverlay.ringEmpty)}
            style={loupe.ringTopStyle}
          />
          <div className={colorPickerOverlay.ringBottom} style={loupe.ringBottomStyle} />
          <div className={colorPickerOverlay.lens}>
            {loupe.cells.map((cell) => (
              <div key={cell.key} style={cell.style} />
            ))}
            <div className={colorPickerOverlay.centerMark} />
          </div>
        </div>
      ) : null}
      {pill ? (
        <div className={colorPickerOverlay.pill} style={pill}>
          {editor.picker.releaseToCancel}
        </div>
      ) : null}
    </div>
  );
}
