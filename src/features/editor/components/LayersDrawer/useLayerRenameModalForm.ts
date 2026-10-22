/**
 * Purpose:
 * LayerRenameModal form behavior: the name draft, the field ids, and submit, which saves the trimmed
 * name or shows an inline error when it is blank.
 */
"use client";

import { useId, useState, type ChangeEvent, type FormEvent } from "react";

import { editor } from "@/content/editor";
import type { ILayerRenameModalFormProps } from "./LayerRenameModal.type";

export function useLayerRenameModalForm({ session, onConfirm }: ILayerRenameModalFormProps) {
  const nameId = useId();
  const errorId = useId();
  const [draft, setDraft] = useState(session.initialName);
  const [error, setError] = useState<string | undefined>(undefined);

  return {
    nameId,
    errorId,
    draft,
    error,
    changeDraft: (event: ChangeEvent<HTMLInputElement>) => {
      setDraft(event.target.value);
      setError(undefined);
    },
    submit: (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const trimmed = draft.trim();
      if (trimmed.length === 0) {
        setError(editor.layers.renameModal.emptyError);
        return;
      }
      onConfirm(trimmed);
    },
  };
}
