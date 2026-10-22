/**
 * Purpose:
 * Unit tests for hex color normalization and parsing of typed or pasted hex values.
 */

import { describe, expect, it } from "vitest";

import { parseHexColor } from "./colorConverter";

describe("parseHexColor", () => {
  it("returns #RRGGBB in upper case for six-digit values with or without #", () => {
    expect(parseHexColor("#1a2b3c")).toBe("#1A2B3C");
    expect(parseHexColor("1A2B3C")).toBe("#1A2B3C");
  });

  it("trims pasted whitespace and expands three-digit shorthand", () => {
    expect(parseHexColor("  #fa0\n")).toBe("#FFAA00");
    expect(parseHexColor("abc")).toBe("#AABBCC");
  });

  it("rejects anything that is not a hex color", () => {
    expect(parseHexColor("")).toBeNull();
    expect(parseHexColor("#12345")).toBeNull();
    expect(parseHexColor("#GGGGGG")).toBeNull();
    expect(parseHexColor("rgb(0,0,0)")).toBeNull();
  });
});
