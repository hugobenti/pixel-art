import { describe, expect, test } from "vitest";

import { discardRedoStack } from "./historyStacks";

describe("discardRedoStack", () => {
  test("clears stale redo commands", () => {
    const redo = [
      { deltas: [], paletteRemoval: { index: 0, color: "#AABBCC", replacement: 0, removedPixels: [] } },
    ];

    discardRedoStack(redo);

    expect(redo).toEqual([]);
  });
});
