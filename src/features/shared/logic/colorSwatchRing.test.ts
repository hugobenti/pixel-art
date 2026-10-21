/**
 * Purpose:
 * Unit tests for picking a palette swatch's selection ring.
 */

import { describe, expect, it } from "vitest";

import { colorSwatchRing } from "@/features/shared/logic/colorSwatchRing";

describe("colorSwatchRing", () => {
  it("marks a selected compact swatch", () => {
    expect(colorSwatchRing({ density: "compact", selected: true })).toBe(
      "selected"
    );
    expect(colorSwatchRing({ density: "compact", selected: false })).toBe(
      "idle"
    );
  });

  it("distinguishes primary, secondary and both on a comfortable swatch", () => {
    const swatch = { density: "comfortable" } as const;
    expect(
      colorSwatchRing({ ...swatch, isPrimary: true, isSecondary: true })
    ).toBe("primaryAndSecondary");
    expect(
      colorSwatchRing({ ...swatch, isPrimary: true, isSecondary: false })
    ).toBe("primary");
    expect(
      colorSwatchRing({ ...swatch, isPrimary: false, isSecondary: true })
    ).toBe("secondary");
    expect(
      colorSwatchRing({ ...swatch, isPrimary: false, isSecondary: false })
    ).toBe("idle");
  });
});
