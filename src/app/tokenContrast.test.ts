import { readFileSync } from "node:fs";

import { describe, expect, test } from "vitest";

import {
  contrastRatio,
  readThemeColors,
} from "@/features/shared/utils/colorContrast";

const tokens = readThemeColors(
  readFileSync(new URL("./globals.css", import.meta.url), "utf8")
);

function ratio(foreground: string, background: string): number {
  const fg = tokens[foreground];
  const bg = tokens[background];
  if (!fg || !bg) {
    throw new Error(`missing color token: ${!fg ? foreground : background}`);
  }
  return contrastRatio(fg, bg);
}

describe("globals.css color tokens meet WCAG 2.2 AA", () => {
  test.each([
    ["fg", "bg"],
    ["fg", "surface"],
    ["fg", "surface-subtle"],
    ["fg", "surface-muted"],
    ["fg-soft", "surface"],
    ["fg-soft", "surface-subtle"],
    ["fg-soft", "surface-muted"],
    ["fg-secondary", "bg"],
    ["fg-secondary", "surface"],
    ["fg-secondary", "surface-subtle"],
    ["muted", "bg"],
    ["muted", "surface"],
    ["muted", "surface-subtle"],
    ["subtle", "surface"],
    ["subtle", "surface-subtle"],
    ["on-accent", "accent"],
    ["on-accent", "accent-hover"],
    ["on-danger", "danger"],
    ["on-danger", "danger-hover"],
    ["danger-fg", "bg"],
    ["danger-fg", "danger-surface"],
    ["danger-fg-strong", "danger-surface"],
    ["success-fg", "success-surface"],
  ])("text %s on %s ≥ 4.5:1", (foreground, background) => {
    expect(ratio(foreground, background)).toBeGreaterThanOrEqual(4.5);
  });

  test.each([
    ["focus", "bg"],
    ["focus", "surface"],
    ["accent", "bg"],
    ["accent", "surface"],
    ["danger", "bg"],
    ["danger", "surface"],
    ["pick-primary", "surface"],
    ["pick-secondary", "surface"],
    ["guide-horizontal", "checker-light"],
    ["guide-horizontal", "checker-dark"],
    ["guide-vertical", "checker-light"],
    ["guide-vertical", "checker-dark"],
    ["surface", "surface-inverse"],
  ])("UI %s on %s ≥ 3:1", (foreground, background) => {
    expect(ratio(foreground, background)).toBeGreaterThanOrEqual(3);
  });
});
