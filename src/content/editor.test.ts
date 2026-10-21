import { describe, expect, it } from "vitest";

import { editor } from "./editor";

describe("editor.settings.imageDetail.summary", () => {
  it("uses singular nouns for a count of one", () => {
    expect(editor.settings.imageDetail.summary(1, 1)).toBe(
      "1 composited pixel across 1 visible cell (layers stacked; no double counting)."
    );
  });

  it("uses plural nouns for other counts", () => {
    expect(editor.settings.imageDetail.summary(0, 12)).toBe(
      "0 composited pixels across 12 visible cells (layers stacked; no double counting)."
    );
  });
});

describe("editor.toolbar.slot.label", () => {
  it("names the active slot", () => {
    expect(editor.toolbar.slot.label(editor.toolbar.slot.secondary)).toBe(
      "Painting slot: Secondary. Click to switch."
    );
  });
});
