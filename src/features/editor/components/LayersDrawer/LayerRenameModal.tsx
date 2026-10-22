/**
 * Purpose:
 * Small dialog to edit a layer name (replaces window.prompt for accessibility and layout control).
 */
"use client";

import { editor } from "@/content/editor";
import { shared } from "@/content/shared";
import { Button } from "@/features/shared/components/Button";
import { FormField } from "@/features/shared/components/FormField";
import { Input } from "@/features/shared/components/Input";
import { Modal } from "@/features/shared/components/Modal";
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
  const { nameId, errorId, draft, error, changeDraft, submit } = useLayerRenameModalForm(props);

  return (
    <Modal
      open
      onClose={onDismiss}
      title={editor.layers.renameModal.title}
      size="sm"
      layer="elevated"
      dim="scrim"
      onSubmit={submit}
      footer={
        <>
          <Button type="button" variant="ghost" onClick={onDismiss}>
            {shared.actions.cancel}
          </Button>
          <Button type="submit" variant="primary">
            {shared.actions.save}
          </Button>
        </>
      }
    >
      <FormField
        label={editor.layers.renameModal.nameLabel}
        htmlFor={nameId}
        error={error}
        errorId={errorId}
      >
        <Input
          id={nameId}
          name="layerName"
          autoComplete="off"
          spellCheck={false}
          data-autofocus
          value={draft}
          onChange={changeDraft}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
        />
      </FormField>
    </Modal>
  );
}
