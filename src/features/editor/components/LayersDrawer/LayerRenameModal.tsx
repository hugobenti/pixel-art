/**
 * Purpose:
 * Small dialog to edit a layer name (replaces window.prompt for accessibility and layout control).
 */
"use client";

import { useState } from "react";

import { editor } from "@/content/editor";
import { shared } from "@/content/shared";
import { Button } from "@/features/shared/components/Button";
import { Input } from "@/features/shared/components/Input";
import { Modal } from "@/features/shared/components/Modal";
import type { ILayerRenameModalProps, ILayerRenameModalFormProps } from "./LayerRenameModal.type";

const titleClass = "text-base font-semibold text-fg";

const fieldWrapClass = "mt-3";

const actionsClass = "mt-4 flex justify-end gap-2";

export function LayerRenameModal(props: ILayerRenameModalProps) {
  const { session } = props;
  if (!session) {
    return null;
  }
  return <LayerRenameModalForm key={session.layerId} {...props} session={session} />;
}

function LayerRenameModalForm({
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

  return (
    <Modal
      open
      onClose={onDismiss}
      placement="center"
      size="sm"
      layer="elevated"
      backdropBlur={false}
      overlayProps={{ "aria-labelledby": "layer-rename-title" }}
    >
      <h2 id="layer-rename-title" className={titleClass}>
        {editor.layers.renameModal.title}
      </h2>
      <div className={fieldWrapClass}>
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submit();
            }
            if (e.key === "Escape") {
              e.preventDefault();
              onDismiss();
            }
          }}
          aria-label={editor.layers.renameModal.nameLabel}
        />
      </div>
      <div className={actionsClass}>
        <Button type="button" variant="ghost" onClick={onDismiss}>
          {shared.actions.cancel}
        </Button>
        <Button
          type="button"
          variant="primary"
          disabled={!canSave}
          onClick={submit}
        >
          {shared.actions.save}
        </Button>
      </div>
    </Modal>
  );
}
