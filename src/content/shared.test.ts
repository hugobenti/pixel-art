import { describe, expect, it } from "vitest";

import { shared } from "./shared";

describe("shared.colorSwatch.selectLabel", () => {
  it("names the position and hex value", () => {
    expect(shared.colorSwatch.selectLabel(3, "#FF0000")).toBe("Select palette color 3 (#FF0000)");
  });

  it("appends every painting slot the color fills", () => {
    expect(
      shared.colorSwatch.selectLabel(1, "#000000", { primary: true, secondary: true })
    ).toBe("Select palette color 1 (#000000), primary, secondary");
    expect(shared.colorSwatch.selectLabel(2, "#FFFFFF", { secondary: true })).toBe(
      "Select palette color 2 (#FFFFFF), secondary"
    );
  });
});
