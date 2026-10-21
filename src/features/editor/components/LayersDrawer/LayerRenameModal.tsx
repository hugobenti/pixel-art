/**
 * Purpose:
 * Small dialog to edit a layer name (replaces window.prompt for accessibility and layout control).
 */
"use client";

import { Button } from "@/features/shared/components/Button";
import { Input } from "@/features/shared/components/Input";
import { Modal } from "@/features/shared/components/Modal";

import { layerRenameModal } from "@/features/editor/components/LayersDrawer/LayerRenameModal.style";
import type { LayerRenameSession } from "@/features/editor/components/LayersDrawer/hooks/useLayerRenameDialog";
import { useLayerRenameForm } from "@/features/editor/components/LayersDrawer/hooks/useLayerRenameForm";

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
  const { draft, canSave, submit, onDraftChange, onDraftKeyDown } = useLayerRenameForm({
    initialName: session.initialName,
    onDismiss,
    onConfirm,
  });

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
      <h3 id="layer-rename-title" className={layerRenameModal.title}>
        Rename layer
      </h3>
      <div className={layerRenameModal.fieldWrap}>
        <Input
          autoFocus
          value={draft}
          onChange={onDraftChange}
          onKeyDown={onDraftKeyDown}
          aria-label="Layer name"
        />
      </div>
      <div className={layerRenameModal.actions}>
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
