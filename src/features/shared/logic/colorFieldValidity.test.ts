import { describe, expect, test } from "vitest";

import { isColorFieldDraftValid } from "./colorFieldValidity";

describe("isColorFieldDraftValid", () => {
  test("accepts a complete hex color draft", () => {
    expect(isColorFieldDraftValid("#12aBcD")).toBe(true);
  });

  test("rejects incomplete and non-hex drafts", () => {
    expect(isColorFieldDraftValid("#12")).toBe(false);
    expect(isColorFieldDraftValid("#GGGGGG")).toBe(false);
  });
});
