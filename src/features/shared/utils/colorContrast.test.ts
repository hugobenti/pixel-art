import { describe, expect, test } from "vitest";

import {
  contrastRatio,
  readSelectorColors,
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

describe("readSelectorColors", () => {
  const css = `
    @theme static { --color-surface: #ffffff; }
    /* Dark theme: warm graphite. */
    [data-theme="dark"] {
      --color-surface: #1c1b19;
      --color-grid-line: color-mix(in srgb, var(--color-muted) 34%, transparent);
      color-scheme: dark;
    }
    [data-theme="dim"] { --color-surface: #333333; }
  `;

  test("reads the --color-* declarations of the exact selector's block", () => {
    expect(readSelectorColors(css, '[data-theme="dark"]')).toEqual({
      surface: "#1c1b19",
      "grid-line": "color-mix(in srgb, var(--color-muted) 34%, transparent)",
    });
  });

  test("returns nothing for a selector that has no block", () => {
    expect(readSelectorColors(css, '[data-theme="sepia"]')).toEqual({});
  });
});
