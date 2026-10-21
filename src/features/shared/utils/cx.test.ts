import { describe, expect, it } from "vitest";

import { cx } from "@/features/shared/utils/cx";

describe("cx", () => {
  it("joins class names with single spaces", () => {
    expect(cx("a b", "c")).toBe("a b c");
  });

  it("skips false, null, undefined and empty parts", () => {
    expect(cx("a", false, null, undefined, "", "b")).toBe("a b");
  });

  it("returns an empty string when nothing is given", () => {
    expect(cx()).toBe("");
  });
});
