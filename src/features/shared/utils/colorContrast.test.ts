import { describe, expect, test } from "vitest";

import {
  contrastRatio,
  readThemeColors,
} from "@/features/shared/utils/colorContrast";

describe("contrastRatio", () => {
  test("matches WCAG reference values", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 1);
    expect(contrastRatio("#777777", "#ffffff")).toBeCloseTo(4.48, 2);
    expect(contrastRatio("#fff", "#000")).toBeCloseTo(21, 1);
  });

  test("is symmetric", () => {
    expect(contrastRatio("#155dfc", "#fafafa")).toBeCloseTo(
      contrastRatio("#fafafa", "#155dfc"),
      10
    );
  });

  test("is 1 for identical colors", () => {
    expect(contrastRatio("#cfd9df", "#CFD9DF")).toBe(1);
  });

  test("rejects values it cannot judge", () => {
    expect(() => contrastRatio("#00000080", "#fff")).toThrow(/opaque hex/);
    expect(() => contrastRatio("blue", "#fff")).toThrow(/opaque hex/);
  });
});

describe("readThemeColors", () => {
  test("reads --color-* declarations inside @theme blocks", () => {
    const css = `
      @import "tailwindcss";
      @theme static {
        --color-*: initial;
        --color-surface: #ffffff;
        --color-grid-line: color-mix(in srgb, var(--color-fg) 52%, transparent);
        --font-sans: var(--font-geist-sans);
      }
    `;
    expect(readThemeColors(css)).toEqual({
      surface: "#ffffff",
      "grid-line": "color-mix(in srgb, var(--color-fg) 52%, transparent)",
    });
  });

  test("ignores color variables declared outside @theme", () => {
    const css = `
      :root { --color-outside: #123456; }
      @theme { --color-inside: #abcdef; }
    `;
    expect(readThemeColors(css)).toEqual({ inside: "#abcdef" });
  });
});
