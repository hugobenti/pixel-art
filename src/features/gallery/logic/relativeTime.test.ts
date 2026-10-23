import { describe, expect, it } from "vitest";

import { relativeTimeParts } from "./relativeTime";

const S = 1000;
const MIN = 60 * S;
const H = 60 * MIN;
const D = 24 * H;
const NOW = 1_700_000_000_000;

const parts = (elapsed: number) => relativeTimeParts(NOW - elapsed, NOW);

describe("relativeTimeParts", () => {
  it.each([0, 59 * S, -10 * S])("returns null for %i ms elapsed", (elapsed) => {
    expect(parts(elapsed)).toBeNull();
  });

  it.each([
    [60 * S, 1, "minute"],
    [59 * MIN, 59, "minute"],
    [2 * H + 5 * MIN, 2, "hour"],
    [23 * H + 59 * MIN, 23, "hour"],
    [24 * H, 1, "day"],
    [29 * D, 29, "day"],
    [30 * D, 1, "month"],
    [364 * D, 12, "month"],
    [365 * D, 1, "year"],
  ] as const)("maps %i ms to %i %s", (elapsed, value, unit) => {
    expect(parts(elapsed)).toEqual({ value, unit });
  });
});
