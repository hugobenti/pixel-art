/**
 * Purpose:
 * Unit tests for contain-fit viewport math.
 */

import { describe, expect, it } from "vitest";

import { computeContainFit, containFitViewport } from "@/features/editor/logic/viewportFit";

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

describe("containFitViewport", () => {
  it("allows zooming out to three quarters of the contain-fit scale", () => {
    expect(containFitViewport(100, 50, 10, 10).minScale).toBe(3.75);
  });

  it("snaps the contain fit to integer scale and offsets", () => {
    expect(containFitViewport(100, 50, 10, 10).viewport).toEqual({
      scale: 5,
      viewOffset: { x: 25, y: 0 },
    });
    expect(containFitViewport(95, 70, 32, 32).viewport).toEqual({
      scale: 2,
      viewOffset: { x: 13, y: 0 },
    });
  });

  it("never snaps the scale below one CSS pixel per artwork pixel", () => {
    expect(containFitViewport(10, 10, 1000, 1000).viewport.scale).toBe(1);
  });
});
