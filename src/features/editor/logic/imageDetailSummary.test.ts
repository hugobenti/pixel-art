/**
 * Purpose:
 * Unit tests for image detail summary copy and palette share percentages.
 */

import { describe, expect, it } from "vitest";

import {
  formatImageDetailSummary,
  paletteSharePercent,
} from "@/features/editor/logic/imageDetailSummary";

describe("formatImageDetailSummary", () => {
  it("explains when no artwork cell is visible", () => {
    expect(formatImageDetailSummary(0, 0)).toBe(
      "No artwork pixels intersect the visible viewport.",
    );
  });

  it("uses singular nouns for one pixel and one cell", () => {
    expect(formatImageDetailSummary(1, 1)).toBe(
      "1 composited pixel across 1 visible cell (layers stacked; no double counting).",
    );
  });

  it("uses plural nouns otherwise", () => {
    expect(formatImageDetailSummary(0, 12)).toBe(
      "0 composited pixels across 12 visible cells (layers stacked; no double counting).",
    );
    expect(formatImageDetailSummary(5, 9)).toBe(
      "5 composited pixels across 9 visible cells (layers stacked; no double counting).",
    );
  });
});

describe("paletteSharePercent", () => {
  it("rounds to one decimal place", () => {
    expect(paletteSharePercent(1, 3)).toBe(33.3);
    expect(paletteSharePercent(2, 3)).toBe(66.7);
    expect(paletteSharePercent(4, 4)).toBe(100);
  });

  it("returns 0 when there are no opaque pixels", () => {
    expect(paletteSharePercent(0, 0)).toBe(0);
  });
});
