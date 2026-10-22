/**
 * Purpose:
 * ShiftDirectionOverlay behavior: keeps keyboard focus inside the dialog while it is open.
 *
 * Notes:
 * Escape is handled by usePixelShift, which owns the open state.
 */
"use client";

import { useRef } from "react";

import { useFocusTrap } from "@/features/shared/hooks/useFocusTrap";

export function useShiftDirectionOverlay(open: boolean) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(dialogRef, open);

  return { dialogRef };
}
