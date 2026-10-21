import { describe, expect, it } from "vitest";

import { focusTrapTargetIndex } from "@/features/shared/logic/focusTrap";

describe("focusTrapTargetIndex", () => {
  it("returns null when there is nothing focusable", () => {
    expect(focusTrapTargetIndex(-1, 0, false)).toBeNull();
  });

  it("wraps Tab from the last element to the first", () => {
    expect(focusTrapTargetIndex(2, 3, false)).toBe(0);
  });

  it("wraps Shift+Tab from the first element to the last", () => {
    expect(focusTrapTargetIndex(0, 3, true)).toBe(2);
  });

  it("lets the browser move focus between inner elements", () => {
    expect(focusTrapTargetIndex(0, 3, false)).toBeNull();
    expect(focusTrapTargetIndex(2, 3, true)).toBeNull();
  });

  it("pulls focus back in when it is outside the container", () => {
    expect(focusTrapTargetIndex(-1, 3, false)).toBe(0);
    expect(focusTrapTargetIndex(-1, 3, true)).toBe(2);
  });
});
