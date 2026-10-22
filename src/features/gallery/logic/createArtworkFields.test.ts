/**
 * Purpose:
 * Unit tests for parsing and validating the new-artwork size fields.
 */

import { describe, expect, it } from "vitest";

import { parseCanvasSizeFields } from "./createArtworkFields";

const message = "out of range";

describe("parseCanvasSizeFields", () => {
  it("returns the size when both fields are whole numbers in range", () => {
    expect(parseCanvasSizeFields("16", " 32 ", 1000, message)).toEqual({
      size: { width: 16, height: 32 },
      errors: {},
    });
  });

  it("flags zero, negative and above-maximum values", () => {
    expect(parseCanvasSizeFields("0", "1001", 1000, message)).toEqual({
      size: null,
      errors: { width: message, height: message },
    });
    expect(parseCanvasSizeFields("-4", "8", 1000, message).errors).toEqual({ width: message });
  });

  it("flags text that is not a whole number instead of ignoring it", () => {
    expect(parseCanvasSizeFields("abc", "", 1000, message).errors).toEqual({
      width: message,
      height: message,
    });
    expect(parseCanvasSizeFields("12px", "1.5", 1000, message).errors).toEqual({
      width: message,
      height: message,
    });
  });
});
