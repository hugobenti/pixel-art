/**
 * Purpose:
 * Unit tests for the integer thumbnail scale.
 */

import { describe, expect, it } from "vitest";

import { thumbnailScale } from "@/features/shared/artwork/thumbnailScale";

describe("thumbnailScale", () => {
  it("picks the largest integer scale that fits the target", () => {
    expect(thumbnailScale(16, 16)).toBe(16);
    expect(thumbnailScale(32, 32)).toBe(8);
    expect(thumbnailScale(100, 100)).toBe(2);
  });

  it("uses the longer side so the aspect ratio is kept", () => {
    expect(thumbnailScale(64, 16)).toBe(4);
    expect(thumbnailScale(10, 50)).toBe(5);
  });

  it("never goes below native size", () => {
    expect(thumbnailScale(300, 300)).toBe(1);
    expect(thumbnailScale(1000, 20)).toBe(1);
  });

  it("honors a custom target", () => {
    expect(thumbnailScale(16, 16, 100)).toBe(6);
  });
});
