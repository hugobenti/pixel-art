/**
 * Purpose:
 * Bottom-screen overlay with directional controls for circular pixel grid shifts.
 */
"use client";

import { editor } from "@/content/editor";
import { Button } from "@/features/shared/components/Button";
import { PublicMaskIcon } from "@/features/shared/components/PublicMaskIcon";
import { PUBLIC_ICONS } from "@/features/shared/constants/publicIcons";
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
            variant="outline"
            className={shiftDirectionOverlay.arrow}
            title={editor.shiftOverlay.directions.up.title}
            aria-label={editor.shiftOverlay.directions.up.label}
            onClick={() => onShift("up")}
          >
            <PublicMaskIcon
              src={PUBLIC_ICONS.chevronUp}
              className={shiftDirectionOverlay.arrowIcon}
            />
          </Button>
          <div className={shiftDirectionOverlay.sideRow}>
            <Button
              type="button"
              variant="outline"
              className={shiftDirectionOverlay.arrow}
              title={editor.shiftOverlay.directions.left.title}
              aria-label={editor.shiftOverlay.directions.left.label}
              onClick={() => onShift("left")}
            >
              <PublicMaskIcon
                src={PUBLIC_ICONS.chevronLeft}
                className={shiftDirectionOverlay.arrowIcon}
              />
            </Button>
            <Button
              type="button"
              variant="outline"
              className={shiftDirectionOverlay.arrow}
              title={editor.shiftOverlay.directions.right.title}
              aria-label={editor.shiftOverlay.directions.right.label}
              onClick={() => onShift("right")}
            >
              <PublicMaskIcon
                src={PUBLIC_ICONS.chevronRight}
                className={shiftDirectionOverlay.arrowIcon}
              />
            </Button>
          </div>
          <Button
            type="button"
            variant="outline"
            className={shiftDirectionOverlay.arrow}
            title={editor.shiftOverlay.directions.down.title}
            aria-label={editor.shiftOverlay.directions.down.label}
            onClick={() => onShift("down")}
          >
            <PublicMaskIcon
              src={PUBLIC_ICONS.chevronDown}
              className={shiftDirectionOverlay.arrowIcon}
            />
          </Button>
        </div>
      </div>
    </div>
  );
}
