/**
 * Purpose:
 * Unit tests for choosing which side of its trigger a dropdown menu opens on.
 */

import { describe, expect, it } from "vitest";

import { menuPlacement } from "./menuPlacement";

describe("menuPlacement", () => {
  it("opens below when it fits", () => {
    expect(
      menuPlacement({
        triggerTop: 100,
        triggerBottom: 140,
        menuHeight: 130,
        viewportHeight: 844,
        gap: 4,
      }),
    ).toBe("below");
  });

  it("opens above when below would pass the viewport", () => {
    expect(
      menuPlacement({
        triggerTop: 747,
        triggerBottom: 787,
        menuHeight: 130,
        viewportHeight: 844,
        gap: 4,
      }),
    ).toBe("above");
  });

  it("fits exactly below at the edge", () => {
    expect(
      menuPlacement({
        triggerTop: 600,
        triggerBottom: 706,
        menuHeight: 130,
        viewportHeight: 844,
        gap: 4,
      }),
    ).toBe("below");
  });

  it("picks the roomier side when neither fits", () => {
    expect(
      menuPlacement({
        triggerTop: 300,
        triggerBottom: 340,
        menuHeight: 400,
        viewportHeight: 600,
        gap: 4,
      }),
    ).toBe("above");
  });
});
