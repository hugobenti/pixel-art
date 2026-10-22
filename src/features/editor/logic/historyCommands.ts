/**
 * Purpose:
 * Pure undo/redo application of history commands to layer buffers: pixel deltas and palette-color
 * removals, plus the palette a command leaves behind.
 */

import {
  reapplyPaletteRemoval,
  revertPaletteRemoval,
} from "@/features/editor/logic/paletteMutations";
import type { IPaletteLayerBuffer } from "@/features/editor/logic/paletteMutations.type";
import type { IHistoryCommand, THistoryDirection } from "@/features/editor/types/editor.type";

export function isEmptyHistoryCommand(cmd: IHistoryCommand): boolean {
  return cmd.deltas.length === 0 && !cmd.paletteRemoval;
}

/** Mutates the layer buffers so they match the state before (undo) or after (redo) the command. */
export function applyHistoryCommand(
  cmd: IHistoryCommand,
  direction: THistoryDirection,
  layers: readonly IPaletteLayerBuffer[],
): void {
  const buffers = new Map(layers.map((layer) => [layer.id, layer.pixelData]));
  if (direction === "undo") {
    for (let i = cmd.deltas.length - 1; i >= 0; i--) {
      const d = cmd.deltas[i];
      const buf = buffers.get(d.layerId);
      if (buf) {
        buf[d.index] = d.previousPaletteIndex;
      }
    }
    if (cmd.paletteRemoval) {
      revertPaletteRemoval(cmd.paletteRemoval, layers);
    }
    return;
  }
  if (cmd.paletteRemoval) {
    reapplyPaletteRemoval(cmd.paletteRemoval, layers);
  }
  for (const d of cmd.deltas) {
    const buf = buffers.get(d.layerId);
    if (buf) {
      buf[d.index] = d.newPaletteIndex;
    }
  }
}

/** The palette after undoing or redoing the command (unchanged unless it removed a color). */
export function paletteAfterHistory(
  palette: string[],
  cmd: IHistoryCommand,
  direction: THistoryDirection,
): string[] {
  const removal = cmd.paletteRemoval;
  if (!removal) {
    return palette;
  }
  if (direction === "undo") {
    return [...palette.slice(0, removal.index), removal.color, ...palette.slice(removal.index)];
  }
  return palette.filter((_, i) => i !== removal.index);
}
