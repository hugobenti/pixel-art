import { describe, expect, it } from "vitest";

import {
  KEYBOARD_PAN_FAST_STEP_PX,
  KEYBOARD_PAN_STEP_PX,
  keyboardPanDelta,
} from "@/features/editor/logic/keyboardPan";

describe("keyboardPanDelta", () => {
  it("moves the artwork in the arrow direction", () => {
    expect(keyboardPanDelta("ArrowLeft", false)).toEqual({ dx: -KEYBOARD_PAN_STEP_PX, dy: 0 });
    expect(keyboardPanDelta("ArrowRight", false)).toEqual({ dx: KEYBOARD_PAN_STEP_PX, dy: 0 });
    expect(keyboardPanDelta("ArrowUp", false)).toEqual({ dx: 0, dy: -KEYBOARD_PAN_STEP_PX });
    expect(keyboardPanDelta("ArrowDown", false)).toEqual({ dx: 0, dy: KEYBOARD_PAN_STEP_PX });
  });

  it("uses the larger step while Shift is held", () => {
    expect(keyboardPanDelta("ArrowDown", true)).toEqual({ dx: 0, dy: KEYBOARD_PAN_FAST_STEP_PX });
  });

  it("ignores keys that are not arrows", () => {
    expect(keyboardPanDelta("a", false)).toBeNull();
    expect(keyboardPanDelta(" ", false)).toBeNull();
  });
});
