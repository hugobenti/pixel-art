/**
 * Purpose:
 * Bottom-screen overlay with directional controls for circular pixel grid shifts.
 */
"use client";

import type { ShiftDirection } from "@/features/editor/logic/pixelShift";

import { Button } from "@/features/shared/components/Button";

interface ShiftDirectionOverlayProps {
  open: boolean;
  onClose: () => void;
  onShift: (direction: ShiftDirection) => void;
}

const backdropClass = `
  fixed inset-0 z-40 bg-zinc-900/30 
`;

const bottomControlsClass = `
  pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-6 pt-4
`;

const arrowPadClass = `
  pointer-events-auto flex flex-col items-center rounded-full border border-zinc-200 bg-mist-800 opacity-90 p-2 shadow-lg w-40 h-40
`;

const arrowSideRowClass = `flex items-center justify-between w-36 gap-2`;

const arrowButtonClass = `
  flex h-12 min-w-12 items-center justify-center rounded-xl px-2 text-xl font-semibold bg-white
`;

export function ShiftDirectionOverlay({
  open,
  onClose,
  onShift,
}: ShiftDirectionOverlayProps) {
  if (!open) {
    return null;
  }

  const handleShift = (direction: ShiftDirection) => {
    onShift(direction);
  };

  return (
    <>
      <button
        type="button"
        className={backdropClass}
        aria-label="Close shift controls"
        onClick={onClose}
      />
      <div className={bottomControlsClass}>
        <div className={arrowPadClass} role="group" aria-label="Shift pixels">
          <Button
            type="button"
            variant="ghost"
            className={arrowButtonClass}
            title="Shift up (wrap)"
            aria-label="Shift pixels up"
            onClick={() => handleShift("up")}
          >
            ↑
          </Button>
          <div className={arrowSideRowClass}>
            <Button
              type="button"
              variant="ghost"
              className={arrowButtonClass}
              title="Shift left (wrap)"
              aria-label="Shift pixels left"
              onClick={() => handleShift("left")}
            >
              ←
            </Button>
            <Button
              type="button"
              variant="ghost"
              className={arrowButtonClass}
              title="Shift right (wrap)"
              aria-label="Shift pixels right"
              onClick={() => handleShift("right")}
            >
              →
            </Button>
          </div>
          <Button
            type="button"
            variant="ghost"
            className={arrowButtonClass}
            title="Shift down (wrap)"
            aria-label="Shift pixels down"
            onClick={() => handleShift("down")}
          >
            ↓
          </Button>
        </div>
      </div>
    </>
  );
}
