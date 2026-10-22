/**
 * Purpose:
 * Unit tests for applying undo/redo history commands to layer buffers (pixel deltas and palette removals).
 */

import { describe, expect, it } from "vitest";

import {
  applyHistoryCommand,
  isEmptyHistoryCommand,
  paletteAfterHistory,
} from "@/features/editor/logic/historyCommands";
import { removePaletteColor } from "@/features/editor/logic/paletteMutations";
import type { IHistoryCommand } from "@/features/editor/types/editor.type";

const PALETTE = ["#000000", "#ff0000", "#00ff00"];

describe("applyHistoryCommand", () => {
  it("reverts pixel deltas on undo and reapplies them on redo", () => {
    const buf = Uint8Array.from([0, 0, 0]);
    const layers = [{ id: "a", pixelData: buf }];
    const cmd: IHistoryCommand = {
      deltas: [
        { layerId: "a", index: 1, previousPaletteIndex: 0, newPaletteIndex: 2 },
        { layerId: "a", index: 2, previousPaletteIndex: 0, newPaletteIndex: 1 },
      ],
    };
    buf.set([0, 2, 1]);

    applyHistoryCommand(cmd, "undo", layers, PALETTE.length);
    expect(Array.from(buf)).toEqual([0, 0, 0]);
    expect(paletteAfterHistory(PALETTE, cmd, "undo")).toBe(PALETTE);

    applyHistoryCommand(cmd, "redo", layers, PALETTE.length);
    expect(Array.from(buf)).toEqual([0, 2, 1]);
  });

  it("undo of a palette removal restores the color and its pixels; redo removes them again", () => {
    const layer = { id: "a", pixelData: Uint8Array.from([0, 1, 2, 1, 255]) };
    const layers = [layer];
    const result = removePaletteColor([layer], PALETTE, 1, { primaryIndex: 1, secondaryIndex: 2 }, 0);
    if (!result) {
      throw new Error("expected a removal");
    }
    const cmd: IHistoryCommand = { deltas: [], paletteRemoval: result.removal };

    applyHistoryCommand(cmd, "undo", layers, result.palette.length);
    const restored = paletteAfterHistory(result.palette, cmd, "undo");
    expect(restored).toEqual(PALETTE);
    expect(Array.from(layer.pixelData)).toEqual([0, 1, 2, 1, 255]);

    applyHistoryCommand(cmd, "redo", layers, restored.length);
    expect(paletteAfterHistory(restored, cmd, "redo")).toEqual(["#000000", "#00ff00"]);
    expect(Array.from(layer.pixelData)).toEqual([0, 0, 1, 0, 255]);
  });

  it("redo of a palette removal paints the same replacement again", () => {
    const layer = { id: "a", pixelData: Uint8Array.from([0, 1, 2, 1, 255]) };
    const layers = [layer];
    const result = removePaletteColor(layers, PALETTE, 1, { primaryIndex: 0, secondaryIndex: 1 }, null);
    if (!result) {
      throw new Error("expected a removal");
    }
    const cmd: IHistoryCommand = { deltas: [], paletteRemoval: result.removal };

    applyHistoryCommand(cmd, "undo", layers, result.palette.length);
    applyHistoryCommand(cmd, "redo", layers, PALETTE.length);

    expect(Array.from(layer.pixelData)).toEqual([0, 255, 1, 255, 255]);
  });
});

describe("isEmptyHistoryCommand", () => {
  it("is empty only without deltas and without a palette change", () => {
    expect(isEmptyHistoryCommand({ deltas: [] })).toBe(true);
    expect(
      isEmptyHistoryCommand({
        deltas: [],
        paletteRemoval: { index: 0, color: "#000000", replacement: 0, removedPixels: [] },
      }),
    ).toBe(false);
    expect(
      isEmptyHistoryCommand({ deltas: [], paletteAppend: { index: 3, color: "#ABCDEF" } }),
    ).toBe(false);
  });
});

describe("palette append history", () => {
  it("undo removes the appended color; redo appends it again", () => {
    const cmd: IHistoryCommand = { deltas: [], paletteAppend: { index: 3, color: "#ABCDEF" } };
    const appended = [...PALETTE, "#ABCDEF"];

    expect(paletteAfterHistory(appended, cmd, "undo")).toEqual(PALETTE);
    expect(paletteAfterHistory(PALETTE, cmd, "redo")).toEqual(appended);
  });

  it("undoing remove → add on a full palette never exceeds 256 colors", () => {
    const full = Array.from({ length: 256 }, (_, i) => `#${i.toString(16).padStart(6, "0")}`);
    const layer = { id: "a", pixelData: Uint8Array.from([0, 5, 200]) };
    const layers = [layer];
    const removed = removePaletteColor(layers, full, 5, { primaryIndex: 0, secondaryIndex: 1 }, 0);
    if (!removed) {
      throw new Error("expected a removal");
    }
    const removal: IHistoryCommand = { deltas: [], paletteRemoval: removed.removal };
    const append: IHistoryCommand = {
      deltas: [],
      paletteAppend: { index: removed.palette.length, color: "#ABCDEF" },
    };
    let palette = paletteAfterHistory(removed.palette, append, "redo");
    expect(palette).toHaveLength(256);

    for (const cmd of [append, removal]) {
      applyHistoryCommand(cmd, "undo", layers, palette.length);
      palette = paletteAfterHistory(palette, cmd, "undo");
      expect(palette.length).toBeLessThanOrEqual(256);
    }

    expect(palette).toEqual(full);
    expect(Array.from(layer.pixelData)).toEqual([0, 5, 200]);
  });
});
