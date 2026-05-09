/**
 * Purpose:
 * Unit tests for pure viewport navigation gesture helpers.
 */

import { describe, expect, it } from "vitest";

import {
  classifyWheelIntent,
  panPixelsFromWheel,
  shouldDeferPrimaryPaint,
  shouldStartPanGesture,
  translateViewOffset,
} from "@/features/editor/services/viewportNavigationService";

function wheel(partial: Partial<WheelEvent>): WheelEvent {
  return partial as WheelEvent;
}

describe("classifyWheelIntent", () => {
  it("returns pan when Shift is held", () => {
    expect(classifyWheelIntent(wheel({ shiftKey: true, deltaX: 0, deltaY: 10 }))).toBe(
      "pan"
    );
  });

  it("returns pan when horizontal delta dominates", () => {
    expect(classifyWheelIntent(wheel({ shiftKey: false, deltaX: 10, deltaY: 2 }))).toBe(
      "pan"
    );
  });

  it("returns zoom for dominant vertical scroll", () => {
    expect(classifyWheelIntent(wheel({ shiftKey: false, deltaX: 1, deltaY: 10 }))).toBe(
      "zoom"
    );
  });
});

describe("panPixelsFromWheel", () => {
  it("maps vertical delta to horizontal pan when Shift is held", () => {
    expect(panPixelsFromWheel(wheel({ shiftKey: true, deltaY: 12 }))).toEqual({
      dx: -12,
      dy: 0,
    });
  });

  it("negates deltaX and deltaY when not shifting", () => {
    expect(panPixelsFromWheel(wheel({ shiftKey: false, deltaX: 3, deltaY: 4 }))).toEqual({
      dx: -3,
      dy: -4,
    });
  });
});

describe("translateViewOffset", () => {
  it("adds deltas to offset", () => {
    expect(translateViewOffset({ x: 1, y: 2 }, 10, -5)).toEqual({ x: 11, y: -3 });
  });
});

describe("shouldStartPanGesture", () => {
  it("pans on middle button", () => {
    expect(
      shouldStartPanGesture({
        pointerButton: 1,
        spaceHeld: false,
        panMode: false,
      })
    ).toBe(true);
  });

  it("pans primary button when Space is held", () => {
    expect(
      shouldStartPanGesture({
        pointerButton: 0,
        spaceHeld: true,
        panMode: false,
      })
    ).toBe(true);
  });

  it("does not pan primary button without Space or pan mode", () => {
    expect(
      shouldStartPanGesture({
        pointerButton: 0,
        spaceHeld: false,
        panMode: false,
      })
    ).toBe(false);
  });
});

describe("shouldDeferPrimaryPaint", () => {
  it("defers when Space or pan mode", () => {
    expect(shouldDeferPrimaryPaint({ spaceHeld: true, panMode: false })).toBe(true);
    expect(shouldDeferPrimaryPaint({ spaceHeld: false, panMode: true })).toBe(true);
    expect(shouldDeferPrimaryPaint({ spaceHeld: false, panMode: false })).toBe(false);
  });
});
