/**
 * Purpose:
 * Small dialog to edit a layer name (replaces window.prompt for accessibility and layout control).
 */
"use client";

import { useState } from "react";

import { Button } from "@/features/shared/components/Button";
import { Input } from "@/features/shared/components/Input";
import { Modal } from "@/features/shared/components/Modal";

import type { LayerRenameSession } from "@/features/editor/components/LayersDrawer/hooks/useLayerRenameDialog";

const titleClass = "text-base font-semibold text-zinc-900";

const fieldWrapClass = "mt-3";

const actionsClass = "mt-4 flex justify-end gap-2";

interface LayerRenameModalProps {
  session: LayerRenameSession | null;
  onDismiss: () => void;
  onConfirm: (nextName: string) => void;
}

export function LayerRenameModal(props: LayerRenameModalProps) {
  const { session } = props;
  if (!session) {
    return null;
  }
  return <LayerRenameModalForm key={session.layerId} {...props} session={session} />;
}

interface LayerRenameModalFormProps {
  session: LayerRenameSession;
  onDismiss: () => void;
  onConfirm: (nextName: string) => void;
}

function LayerRenameModalForm({
  session,
  onDismiss,
  onConfirm,
}: LayerRenameModalFormProps) {
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
      <h3 id="layer-rename-title" className={titleClass}>
        Rename layer
      </h3>
      <div className={fieldWrapClass}>
        <Input
          autoFocus
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
          aria-label="Layer name"
        />
      </div>
      <div className={actionsClass}>
        <Button type="button" variant="ghost" onClick={onDismiss}>
          Cancel
        </Button>
        <Button
          type="button"
          variant="primary"
          disabled={!canSave}
          onClick={submit}
        >
          Save
        </Button>
      </div>
    </Modal>
  );
}
