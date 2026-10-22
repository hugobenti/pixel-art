import { describe, expect, it } from "vitest";

import { cx } from "@/features/shared/utils/cx";

describe("cx", () => {
  it("joins class names with a single space", () => {
    expect(cx("flex", "gap-2", "p-4")).toBe("flex gap-2 p-4");
  });

  it("skips false, null, undefined and empty parts", () => {
    expect(cx("flex", false, null, undefined, "", "p-4")).toBe("flex p-4");
  });

  it("returns an empty string when every part is skipped", () => {
    expect(cx(false, undefined)).toBe("");
  });
});
