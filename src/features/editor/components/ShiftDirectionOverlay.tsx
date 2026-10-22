/**
 * Purpose:
 * Bottom-screen overlay with directional controls for circular pixel grid shifts.
 */
"use client";

import { editor } from "@/content/editor";
import { Button } from "@/features/shared/components/Button";
import { shiftDirectionOverlay } from "./ShiftDirectionOverlay.style";
import type { IShiftDirectionOverlayProps } from "./ShiftDirectionOverlay.type";
import { useShiftDirectionOverlay } from "./useShiftDirectionOverlay";

export function ShiftDirectionOverlay({ open, onClose, onShift }: IShiftDirectionOverlayProps) {
  const { dialogRef } = useShiftDirectionOverlay(open);

  if (!open) {
    return null;
  }

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={editor.shiftOverlay.dialogLabel}
    >
      <button
        type="button"
        tabIndex={-1}
        className={shiftDirectionOverlay.backdrop}
        aria-label={editor.shiftOverlay.closeLabel}
        onClick={onClose}
      />
      <div className={shiftDirectionOverlay.controls}>
        <div
          className={shiftDirectionOverlay.pad}
          role="group"
          aria-label={editor.shiftOverlay.groupLabel}
        >
          <Button
            type="button"
            variant="ghost"
            className={shiftDirectionOverlay.arrow}
            title={editor.shiftOverlay.directions.up.title}
            aria-label={editor.shiftOverlay.directions.up.label}
            onClick={() => onShift("up")}
          >
            {editor.shiftOverlay.directions.up.glyph}
          </Button>
          <div className={shiftDirectionOverlay.sideRow}>
            <Button
              type="button"
              variant="ghost"
              className={shiftDirectionOverlay.arrow}
              title={editor.shiftOverlay.directions.left.title}
              aria-label={editor.shiftOverlay.directions.left.label}
              onClick={() => onShift("left")}
            >
              {editor.shiftOverlay.directions.left.glyph}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className={shiftDirectionOverlay.arrow}
              title={editor.shiftOverlay.directions.right.title}
              aria-label={editor.shiftOverlay.directions.right.label}
              onClick={() => onShift("right")}
            >
              {editor.shiftOverlay.directions.right.glyph}
            </Button>
          </div>
          <Button
            type="button"
            variant="ghost"
            className={shiftDirectionOverlay.arrow}
            title={editor.shiftOverlay.directions.down.title}
            aria-label={editor.shiftOverlay.directions.down.label}
            onClick={() => onShift("down")}
          >
            {editor.shiftOverlay.directions.down.glyph}
          </Button>
        </div>
      </div>
    </div>
  );
}
