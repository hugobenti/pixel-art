/**
 * Purpose:
 * Tests for the horizontal scroll that brings a palette swatch into view.
 */

import { describe, expect, it } from "vitest";

import { scrollLeftToReveal } from "@/features/editor/logic/scrollReveal";

describe("scrollLeftToReveal", () => {
  it("leaves the scroll alone when the item is fully visible", () => {
    expect(
      scrollLeftToReveal({ itemStart: 100, itemEnd: 140, scrollLeft: 50, viewWidth: 300, padding: 4 }),
    ).toBeNull();
  });

  it("scrolls right just enough to show an item past the right edge", () => {
    expect(
      scrollLeftToReveal({ itemStart: 500, itemEnd: 540, scrollLeft: 0, viewWidth: 300, padding: 4 }),
    ).toBe(244);
  });

  it("scrolls left just enough to show an item before the left edge", () => {
    expect(
      scrollLeftToReveal({ itemStart: 40, itemEnd: 80, scrollLeft: 200, viewWidth: 300, padding: 4 }),
    ).toBe(36);
  });

  it("does not scroll past the start of the row", () => {
    expect(
      scrollLeftToReveal({ itemStart: 2, itemEnd: 42, scrollLeft: 0, viewWidth: 300, padding: 4 }),
    ).toBeNull();
    expect(
      scrollLeftToReveal({ itemStart: 2, itemEnd: 42, scrollLeft: 30, viewWidth: 300, padding: 4 }),
    ).toBe(0);
  });
});
