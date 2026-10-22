import { describe, expect, it } from "vitest";

import { menuFocusIndex } from "./menuNavigation";

describe("menuFocusIndex", () => {
  const items = [{ disabled: false }, { disabled: true }, { disabled: false }];

  it("skips disabled items and wraps arrow navigation", () => {
    expect(menuFocusIndex(0, "ArrowDown", items)).toBe(2);
    expect(menuFocusIndex(2, "ArrowDown", items)).toBe(0);
    expect(menuFocusIndex(0, "ArrowUp", items)).toBe(2);
  });

  it("moves Home and End to the first and last enabled item", () => {
    expect(menuFocusIndex(2, "Home", items)).toBe(0);
    expect(menuFocusIndex(0, "End", items)).toBe(2);
  });

  it("returns no target when every item is disabled", () => {
    expect(menuFocusIndex(-1, "ArrowDown", [{ disabled: true }])).toBe(-1);
  });
});
