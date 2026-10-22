/**
 * Purpose:
 * LayerRenameModal form behavior: the name draft, whether it can be saved (non-blank once trimmed),
 * and Enter-to-save / Escape-to-cancel in the name field.
 */
"use client";

import { useState, type ChangeEvent, type KeyboardEvent } from "react";

import type { ILayerRenameModalFormProps } from "./LayerRenameModal.type";

export function useLayerRenameModalForm({
  session,
  onDismiss,
  onConfirm,
}: ILayerRenameModalFormProps) {
  const [draft, setDraft] = useState(session.initialName);

  const trimmed = draft.trim();
  const canSave = trimmed.length > 0;

  const submit = () => {
    if (!canSave) {
      return;
    }
    onConfirm(trimmed);
  };

  return {
    draft,
    canSave,
    submit,
    changeDraft: (event: ChangeEvent<HTMLInputElement>) => setDraft(event.target.value),
    handleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        submit();
      }
      if (event.key === "Escape") {
        event.preventDefault();
        onDismiss();
      }
    },
  };
}
