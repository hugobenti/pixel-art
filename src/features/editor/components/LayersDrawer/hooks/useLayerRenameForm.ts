/**
 * Purpose:
 * Draft name state, validation, and keyboard submit/dismiss for the layer rename dialog form.
 */
"use client";

import { useState, type ChangeEvent, type KeyboardEvent } from "react";

interface UseLayerRenameFormParams {
  initialName: string;
  onDismiss: () => void;
  onConfirm: (nextName: string) => void;
}

export function useLayerRenameForm({
  initialName,
  onDismiss,
  onConfirm,
}: UseLayerRenameFormParams) {
  const [draft, setDraft] = useState(initialName);

  const trimmed = draft.trim();
  const canSave = trimmed.length > 0;

  const submit = () => {
    if (!canSave) {
      return;
    }
    onConfirm(trimmed);
  };

  const onDraftChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDraft(event.target.value);
  };

  const onDraftKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      submit();
    }
    if (event.key === "Escape") {
      event.preventDefault();
      onDismiss();
    }
  };

  return { draft, canSave, submit, onDraftChange, onDraftKeyDown };
}
