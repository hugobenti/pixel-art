/**
 * Purpose:
 * Small dialog to edit a layer name (replaces window.prompt for accessibility and layout control).
 */
"use client";

import { editor } from "@/content/editor";
import { shared } from "@/content/shared";
import { Button } from "@/features/shared/components/Button";
import { Input } from "@/features/shared/components/Input";
import { Modal } from "@/features/shared/components/Modal";
import { layerRenameModal } from "./LayerRenameModal.style";
import type { ILayerRenameModalProps, ILayerRenameModalFormProps } from "./LayerRenameModal.type";
import { useLayerRenameModalForm } from "./useLayerRenameModalForm";

export function LayerRenameModal(props: ILayerRenameModalProps) {
  const { session } = props;
  if (!session) {
    return null;
  }
  return <LayerRenameModalForm key={session.layerId} {...props} session={session} />;
}

function LayerRenameModalForm(props: ILayerRenameModalFormProps) {
  const { onDismiss } = props;
  const { draft, canSave, submit, changeDraft, handleKeyDown } = useLayerRenameModalForm(props);

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
      <h2 id="layer-rename-title" className={layerRenameModal.heading}>
        {editor.layers.renameModal.title}
      </h2>
      <div className={layerRenameModal.field}>
        <Input
          value={draft}
          onChange={changeDraft}
          onKeyDown={handleKeyDown}
          aria-label={editor.layers.renameModal.nameLabel}
        />
      </div>
      <div className={layerRenameModal.actions}>
        <Button type="button" variant="ghost" onClick={onDismiss}>
          {shared.actions.cancel}
        </Button>
        <Button type="button" variant="primary" disabled={!canSave} onClick={submit}>
          {shared.actions.save}
        </Button>
      </div>
    </Modal>
  );
}
