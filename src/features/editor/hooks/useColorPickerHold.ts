/**
 * Purpose:
 * The color picker's press-and-hold: takes a canvas press when the picker is armed (or Alt is held),
 * follows the pointer while it is held, and on release over a color hands that palette index to `onPick`.
 * Also tracks Alt for the toolbar's pressed state and Escape to disarm.
 *
 * Notes:
 * Nothing changes until release, and release over an empty spot or off the canvas does nothing.
 * Escape, pointercancel, a second touch and the window losing focus end the hold the same way.
 * The workspace calls `onPickPointerDown` before painting's handler and paints only when it returns false.
 * See docs/canvas-pointer-contract.md.
 */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  pickSlotForButton,
  pickTargetAt,
  shouldEscapeDisarmPicker,
  shouldStartPickHold,
} from "@/features/editor/logic/colorPicker";
import type { TPickTarget } from "@/features/editor/logic/colorPicker.type";
import { isTextEntryTarget } from "@/features/editor/logic/editorKeyboardGuards";
import type { IPickHold, IUseColorPickerHoldParams } from "./useColorPickerHold.type";

export function useColorPickerHold(params: IUseColorPickerHoldParams) {
  const { canvasRef, touchPointersRef, deferPrimaryPaint, armed, activeSlot, artwork, viewport } = params;
  const [hold, setHold] = useState<IPickHold | null>(null);
  const [altHeld, setAltHeld] = useState(false);
  const holdRef = useRef<IPickHold | null>(null);
  /** An Alt quick pick happened during this Alt press: its keyup must not reach the browser menu. */
  const quickPickRef = useRef(false);
  const latest = useRef(params);

  useEffect(() => {
    latest.current = params;
  });

  const updateHold = useCallback((next: IPickHold | null) => {
    holdRef.current = next;
    setHold(next);
  }, []);

  /** The target under a viewport point, from the canvas's current position and the latest artwork. */
  const locate = useCallback(
    (clientX: number, clientY: number): { target: TPickTarget; canvasLeft: number; canvasTop: number } => {
      const canvas = canvasRef.current;
      if (!canvas) {
        return { target: { kind: "offCanvas" }, canvasLeft: 0, canvasTop: 0 };
      }
      const rect = canvas.getBoundingClientRect();
      const inside =
        clientX >= rect.left && clientX < rect.right && clientY >= rect.top && clientY < rect.bottom;
      const point = inside ? { x: clientX - rect.left, y: clientY - rect.top } : null;
      return {
        target: pickTargetAt(latest.current.artwork, latest.current.viewport, point),
        canvasLeft: rect.left,
        canvasTop: rect.top,
      };
    },
    [canvasRef],
  );

  const holding = hold !== null;

  useEffect(() => {
    if (!holding) {
      return;
    }
    const end = (releaseAt: PointerEvent | null) => {
      const current = holdRef.current;
      if (!current) {
        return;
      }
      updateHold(null);
      if (!releaseAt) {
        return;
      }
      const { target } = locate(releaseAt.clientX, releaseAt.clientY);
      if (target.kind === "color") {
        latest.current.onPick(current.slot, target.paletteIndex);
      }
    };
    const onMove = (e: PointerEvent) => {
      const current = holdRef.current;
      if (!current || e.pointerId !== current.pointerId) {
        return;
      }
      updateHold({ ...current, clientX: e.clientX, clientY: e.clientY, ...locate(e.clientX, e.clientY) });
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerId === holdRef.current?.pointerId) {
        end(e);
      }
    };
    const onCancel = (e: PointerEvent) => {
      if (e.pointerId === holdRef.current?.pointerId) {
        end(null);
      }
    };
    /** Runs after useEditorPointerContacts' capture handler, so the Set already counts this touch. */
    const onSecondTouch = (e: PointerEvent) => {
      if (e.pointerType === "touch" && touchPointersRef.current.size > 1) {
        end(null);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        end(null);
      }
    };
    const onBlur = () => end(null);

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onCancel);
    window.addEventListener("pointerdown", onSecondTouch, true);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onCancel);
      window.removeEventListener("pointerdown", onSecondTouch, true);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("blur", onBlur);
    };
  }, [holding, locate, touchPointersRef, updateHold]);

  // Zoom or an artwork change mid-hold moves what is under a still pointer.
  useEffect(() => {
    const current = holdRef.current;
    if (current) {
      updateHold({ ...current, ...locate(current.clientX, current.clientY) });
    }
  }, [artwork, viewport, locate, updateHold]);

  useEffect(() => {
    if (!armed || holding) {
      return;
    }
    const onKeyDown = (e: KeyboardEvent) => {
      const disarms = shouldEscapeDisarmPicker({
        key: e.key,
        defaultPrevented: e.defaultPrevented,
        textEntry: isTextEntryTarget(e.target as HTMLElement | null),
        panelOpen: latest.current.panelOpen,
      });
      if (disarms) {
        latest.current.onDisarm();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [armed, holding]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Alt" && !isTextEntryTarget(e.target as HTMLElement | null)) {
        setAltHeld(true);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key !== "Alt") {
        return;
      }
      setAltHeld(false);
      if (quickPickRef.current) {
        quickPickRef.current = false;
        e.preventDefault();
      }
    };
    const onBlur = () => setAltHeld(false);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  /** Starts a pick hold when the press belongs to the picker; false leaves the press to painting. */
  const onPickPointerDown = (e: React.PointerEvent<HTMLCanvasElement>): boolean => {
    const starts = shouldStartPickHold({
      armed,
      altKey: e.altKey,
      button: e.button,
      pointerType: e.pointerType,
      touchCount: touchPointersRef.current.size,
      panDeferred: deferPrimaryPaint(),
    });
    if (!starts) {
      return false;
    }
    e.preventDefault();
    if (holdRef.current) {
      return true;
    }
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    if (!armed) {
      quickPickRef.current = true;
    }
    updateHold({
      pointerId: e.pointerId,
      pointerType: e.pointerType,
      slot: pickSlotForButton(e.button, activeSlot),
      clientX: e.clientX,
      clientY: e.clientY,
      ...locate(e.clientX, e.clientY),
    });
    return true;
  };

  return { hold, altHeld, onPickPointerDown };
}
