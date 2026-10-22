/**
 * Purpose:
 * Palette color removal from the edit modal: an unused color is removed at once; a color pixels use
 * opens a confirm step where the user picks what those pixels become (another palette color, the
 * closest one preselected, or transparent).
 *
 * Notes:
 * A palette change while the confirm step is open (e.g. Undo) drops the request, so it never removes
 * or paints with indices from a palette that no longer exists.
 */
"use client";

import { useCallback, useState } from "react";

import { editor } from "@/content/editor";
import { nearestPaletteIndex } from "@/features/editor/logic/paletteMutations";
import type { IConfirmDialogProps } from "@/features/shared/components/ConfirmDialog.type";
import type {
  IPaletteRemovalRequest,
  IPaletteReplacementChoice,
  TUsePaletteRemovalParams,
} from "./usePaletteRemoval.type";

export function usePaletteRemoval({
  palette,
  getColorUsage,
  onRemoveSwatch,
}: TUsePaletteRemovalParams) {
  const [request, setRequest] = useState<IPaletteRemovalRequest | null>(null);
  if (request && request.palette !== palette) {
    setRequest(null);
  }

  const requestRemove = (index: number) => {
    const pixelCount = getColorUsage(index);
    if (pixelCount === 0) {
      onRemoveSwatch(index, null);
      return;
    }
    setRequest({
      index,
      color: palette[index],
      pixelCount,
      palette,
      replacementIndex: nearestPaletteIndex(palette, index),
    });
  };

  const cancel = useCallback(() => setRequest(null), []);

  const dialog: IConfirmDialogProps = {
    options: request
      ? {
          title: editor.paletteRemoval.dialog.title(request.color),
          description: editor.paletteRemoval.dialog.description(request.pixelCount),
          confirmLabel: editor.paletteRemoval.dialog.confirm,
        }
      : null,
    onConfirm: () => {
      if (request) {
        onRemoveSwatch(request.index, request.replacementIndex);
      }
      setRequest(null);
    },
    onCancel: cancel,
  };

  const choices: IPaletteReplacementChoice[] = request
    ? palette
        .map((color, index) => ({ color, index }))
        .filter((choice) => choice.index !== request.index)
    : [];

  return {
    requestRemove,
    dialog,
    choices,
    replacementIndex: request?.replacementIndex ?? null,
    chooseReplacement: (replacementIndex: number | null) =>
      setRequest((current) => (current ? { ...current, replacementIndex } : current)),
  };
}
