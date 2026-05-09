/**
 * Purpose:
 * Small dialog to edit a layer name (replaces window.prompt for accessibility and layout control).
 */
"use client";

import { useState } from "react";

import { Button } from "@/features/shared/components/Button";
import { Input } from "@/features/shared/components/Input";

import type { LayerRenameSession } from "@/features/editor/components/LayersDrawer/hooks/useLayerRenameDialog";

const backdropClass =
  "fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4";

const panelClass =
  "w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-4 shadow-lg";

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
    <div
      className={backdropClass}
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onDismiss();
        }
      }}
    >
      <div
        className={panelClass}
        role="dialog"
        aria-modal="true"
        aria-labelledby="layer-rename-title"
        onMouseDown={(e) => e.stopPropagation()}
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
      </div>
    </div>
  );
}
