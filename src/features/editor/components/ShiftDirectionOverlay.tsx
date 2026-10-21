/**
 * Purpose:
 * Bottom-screen overlay with directional controls for circular pixel grid shifts.
 */
"use client";

import { useRef } from "react";

import { editor } from "@/content/editor";
import type { ShiftDirection } from "@/features/editor/logic/pixelShift";

import { Button } from "@/features/shared/components/Button";
import { useFocusTrap } from "@/features/shared/hooks/useFocusTrap";

interface ShiftDirectionOverlayProps {
  open: boolean;
  onClose: () => void;
  onShift: (direction: ShiftDirection) => void;
}

const backdropClass = `
  fixed inset-0 z-40 bg-scrim/30 
`;

const bottomControlsClass = `
  pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-6 pt-4
`;

const arrowPadClass = `
  pointer-events-auto flex flex-col items-center rounded-full border border-line bg-surface-inverse opacity-90 p-2 shadow-lg w-40 h-40
`;

const arrowSideRowClass = `flex items-center justify-between w-36 gap-2`;

const arrowButtonClass = `
  flex h-12 min-w-12 items-center justify-center rounded-xl px-2 text-xl font-semibold bg-surface
`;

export function ShiftDirectionOverlay({
  open,
  onClose,
  onShift,
}: ShiftDirectionOverlayProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(dialogRef, open);

  if (!open) {
    return null;
  }

  const handleShift = (direction: ShiftDirection) => {
    onShift(direction);
  };

  return (
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={editor.shiftOverlay.dialogLabel}>
      <button
        type="button"
        tabIndex={-1}
        className={backdropClass}
        aria-label={editor.shiftOverlay.closeLabel}
        onClick={onClose}
      />
      <div className={bottomControlsClass}>
        <div className={arrowPadClass} role="group" aria-label={editor.shiftOverlay.groupLabel}>
          <Button
            type="button"
            variant="ghost"
            className={arrowButtonClass}
            title={editor.shiftOverlay.directions.up.title}
            aria-label={editor.shiftOverlay.directions.up.label}
            onClick={() => handleShift("up")}
          >
            {editor.shiftOverlay.directions.up.glyph}
          </Button>
          <div className={arrowSideRowClass}>
            <Button
              type="button"
              variant="ghost"
              className={arrowButtonClass}
              title={editor.shiftOverlay.directions.left.title}
              aria-label={editor.shiftOverlay.directions.left.label}
              onClick={() => handleShift("left")}
            >
              {editor.shiftOverlay.directions.left.glyph}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className={arrowButtonClass}
              title={editor.shiftOverlay.directions.right.title}
              aria-label={editor.shiftOverlay.directions.right.label}
              onClick={() => handleShift("right")}
            >
              {editor.shiftOverlay.directions.right.glyph}
            </Button>
          </div>
          <Button
            type="button"
            variant="ghost"
            className={arrowButtonClass}
            title={editor.shiftOverlay.directions.down.title}
            aria-label={editor.shiftOverlay.directions.down.label}
            onClick={() => handleShift("down")}
          >
            {editor.shiftOverlay.directions.down.glyph}
          </Button>
        </div>
      </div>
    </div>
  );
}
