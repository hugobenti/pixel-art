/**
 * Purpose:
 * Unit tests for contain-fit viewport math.
 */

import { describe, expect, it } from "vitest";

import { computeContainFit } from "@/features/editor/logic/viewportFit";

describe("computeContainFit", () => {
  it("centers square world in square container", () => {
    const v = computeContainFit(100, 100, 10, 10);
    expect(v.scale).toBe(10);
    expect(v.viewOffset.x).toBe(0);
    expect(v.viewOffset.y).toBe(0);
  });

  it("letterboxes when aspect ratios differ", () => {
    const v = computeContainFit(100, 50, 10, 10);
    expect(v.scale).toBe(5);
    expect(v.viewOffset.x).toBe(25);
    expect(v.viewOffset.y).toBe(0);
  });

  it("floors container dimensions to at least 1", () => {
    const v = computeContainFit(0.2, 0.3, 1, 1);
    expect(v.scale).toBe(1);
  });
});
