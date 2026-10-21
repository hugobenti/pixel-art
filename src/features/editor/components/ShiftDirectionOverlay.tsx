/**
 * Purpose:
 * Bottom-screen overlay with directional controls for circular pixel grid shifts.
 */
"use client";

import type { ShiftDirection } from "@/features/editor/logic/pixelShift";

import { shiftDirectionOverlay } from "@/features/editor/components/ShiftDirectionOverlay.style";
import { Button } from "@/features/shared/components/Button";

interface ShiftDirectionOverlayProps {
  open: boolean;
  onClose: () => void;
  onShift: (direction: ShiftDirection) => void;
}

export function ShiftDirectionOverlay({
  open,
  onClose,
  onShift,
}: ShiftDirectionOverlayProps) {
  if (!open) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        className={shiftDirectionOverlay.backdrop}
        aria-label="Close shift controls"
        onClick={onClose}
      />
      <div className={shiftDirectionOverlay.bottomControls}>
        <div
          className={shiftDirectionOverlay.arrowPad}
          role="group"
          aria-label="Shift pixels"
        >
          <Button
            type="button"
            variant="ghost"
            className={shiftDirectionOverlay.arrowButton}
            title="Shift up (wrap)"
            aria-label="Shift pixels up"
            onClick={() => onShift("up")}
          >
            ↑
          </Button>
          <div className={shiftDirectionOverlay.arrowSideRow}>
            <Button
              type="button"
              variant="ghost"
              className={shiftDirectionOverlay.arrowButton}
              title="Shift left (wrap)"
              aria-label="Shift pixels left"
              onClick={() => onShift("left")}
            >
              ←
            </Button>
            <Button
              type="button"
              variant="ghost"
              className={shiftDirectionOverlay.arrowButton}
              title="Shift right (wrap)"
              aria-label="Shift pixels right"
              onClick={() => onShift("right")}
            >
              →
            </Button>
          </div>
          <Button
            type="button"
            variant="ghost"
            className={shiftDirectionOverlay.arrowButton}
            title="Shift down (wrap)"
            aria-label="Shift pixels down"
            onClick={() => onShift("down")}
          >
            ↓
          </Button>
        </div>
      </div>
    </>
  );
}
