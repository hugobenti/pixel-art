/**
 * Purpose:
 * Unit tests for the minimum zoom scale derived from the contain-fit viewport.
 */

import { describe, expect, it } from "vitest";

import { computeContainFit } from "@/features/editor/logic/viewportFit";
import {
  MIN_ZOOM_RATIO_OF_CONTAIN,
  computeViewportMinScale,
} from "@/features/editor/logic/viewportMinScale";

describe("computeViewportMinScale", () => {
  it("is three quarters of the contain-fit scale", () => {
    expect(MIN_ZOOM_RATIO_OF_CONTAIN).toBe(0.75);
    expect(computeViewportMinScale(100, 100, 10, 10)).toBe(7.5);
  });

  it("follows the contain-fit scale for letterboxed documents", () => {
    expect(computeViewportMinScale(100, 50, 10, 10)).toBe(
      computeContainFit(100, 50, 10, 10).scale * 0.75,
    );
  });
});
