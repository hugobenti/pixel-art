/**
 * Purpose:
 * Unit tests for the image detail rows: palette usage sorted by count with its share of opaque pixels.
 */

import { describe, expect, it } from "vitest";

import { paletteUsageRows } from "./paletteUsageRows";

describe("paletteUsageRows", () => {
  it("sorts by count, most used first, then by palette index", () => {
    const counts = new Map([
      [2, 1],
      [0, 3],
      [1, 1],
    ]);
    const rows = paletteUsageRows(counts, 5, ["#000000", "#FFFFFF", "#FF0000"]);
    expect(rows.map((row) => row.paletteIndex)).toEqual([0, 1, 2]);
  });

  it("resolves each index to its palette color, transparent when missing", () => {
    const rows = paletteUsageRows(new Map([[4, 2]]), 2, ["#000000"]);
    expect(rows).toEqual([{ paletteIndex: 4, count: 2, color: "transparent", percent: 100 }]);
  });

  it("gives each share of the opaque total in percent, rounded to one decimal", () => {
    const rows = paletteUsageRows(
      new Map([
        [0, 2],
        [1, 1],
      ]),
      3,
      ["#000000", "#FFFFFF"],
    );
    expect(rows.map((row) => row.percent)).toEqual([66.7, 33.3]);
  });

  it("reports 0% when nothing is opaque", () => {
    expect(paletteUsageRows(new Map([[0, 0]]), 0, ["#000000"])[0].percent).toBe(0);
  });
});
