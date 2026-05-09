/**
 * Purpose:
 * Unit tests for viewport zoom transformations.
 */

import { describe, expect, it } from "vitest";

import {
  zoomViewportTowardScreenPoint,
  zoomViewportTowardScreenPointSnapped,
} from "@/features/editor/logic/viewportZoomMath";

describe("zoomViewportTowardScreenPoint", () => {
  it("keeps world pixel under cursor after scale change", () => {
    const v = { scale: 2, viewOffset: { x: 0, y: 0 } };
    const mx = 10;
    const my = 20;
    const next = zoomViewportTowardScreenPoint(v, 4, mx, my);
    const worldX = (mx - v.viewOffset.x) / v.scale;
    const worldY = (my - v.viewOffset.y) / v.scale;
    const sx = (mx - next.viewOffset.x) / next.scale;
    const sy = (my - next.viewOffset.y) / next.scale;
    expect(sx).toBeCloseTo(worldX);
    expect(sy).toBeCloseTo(worldY);
  });
});

describe("zoomViewportTowardScreenPointSnapped", () => {
  it("returns unchanged viewport when snapped candidate scale equals current", () => {
    const v = { scale: 4, viewOffset: { x: 0, y: 0 } };
    const opts = { minScale: 1, maxScale: 64 };
    const next = zoomViewportTowardScreenPointSnapped(v, 4, 10, 10, opts);
    expect(next).toBe(v);
  });
});
