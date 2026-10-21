/**
 * Purpose:
 * View model for EditorActionsBar: painting-slot toggle label, aria label and button variant.
 */

import type { ColorSlot } from "@/features/editor/logic/paletteMutations";

export function useEditorActionsBar(activeSlot: ColorSlot) {
  const isPrimarySlot = activeSlot === "primary";
  const slotLabel = isPrimarySlot ? "Primary" : "Secondary";

  return {
    slotLabel,
    slotAriaLabel: `Painting slot: ${slotLabel}. Click to switch.`,
    slotVariant: isPrimarySlot ? ("primary" as const) : ("outline" as const),
  };
}
