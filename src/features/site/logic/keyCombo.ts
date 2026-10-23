/**
 * Purpose:
 * Formats a platform-independent key combination for display.
 *
 * Notes:
 * Apple shows glyphs (⇧⌘Z); other platforms show names joined with "+" (Ctrl+Shift+Z).
 */

import type { IKeyCombo } from "@/content/content.type";

import type { IKeyNames, TKeyPlatform } from "./keyCombo.type";

const COMMAND_GLYPH = "⌘";
const SHIFT_GLYPH = "⇧";

function keyLabel(key: string, names: IKeyNames): string {
  if (key === "Space") {
    return names.space;
  }
  if (key === "Arrows") {
    return names.arrows;
  }
  return key.toUpperCase();
}

/** Display text for a key combination on the given platform. */
export function formatKeyCombo(combo: IKeyCombo, platform: TKeyPlatform, names: IKeyNames): string {
  const label = keyLabel(combo.key, names);
  if (platform === "apple") {
    return `${combo.shift ? SHIFT_GLYPH : ""}${combo.mod ? COMMAND_GLYPH : ""}${label}`;
  }
  const parts = [
    ...(combo.mod ? [names.ctrl] : []),
    ...(combo.shift ? [names.shift] : []),
    label,
  ];
  return parts.join("+");
}
