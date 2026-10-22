/**
 * Purpose:
 * Unit tests for parsing whole-number fields and the canvas width/height pair.
 */

import { describe, expect, it } from "vitest";

import { parseCanvasSizeFields, parseWholeNumber } from "./canvasSizeFields";

const message = "out of range";

describe("parseWholeNumber", () => {
  it("returns the value for a trimmed whole number within min and max", () => {
    expect(parseWholeNumber(" 8 ", 1, 10)).toBe(8);
    expect(parseWholeNumber("1", 1, 10)).toBe(1);
    expect(parseWholeNumber("10", 1, 10)).toBe(10);
  });

  it("rejects values outside min and max", () => {
    expect(parseWholeNumber("0", 1, 10)).toBeNull();
    expect(parseWholeNumber("11", 1, 10)).toBeNull();
    expect(parseWholeNumber("4", 5, 10)).toBeNull();
  });

  it("rejects text that is not a whole number", () => {
    expect(parseWholeNumber("", 1, 10)).toBeNull();
    expect(parseWholeNumber("2.5", 1, 10)).toBeNull();
    expect(parseWholeNumber("-3", -5, 10)).toBeNull();
  });
});

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
