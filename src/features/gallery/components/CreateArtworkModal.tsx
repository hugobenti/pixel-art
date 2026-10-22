/**
 * Purpose:
 * Modal dialog to create a new artwork with title, canvas size, and background color.
 */
"use client";

import { gallery } from "@/content/gallery";
import { shared } from "@/content/shared";
import { Button } from "@/features/shared/components/Button";
import { FormField } from "@/features/shared/components/FormField";
import { Input } from "@/features/shared/components/Input";
import { Modal } from "@/features/shared/components/Modal";
import { useCreateArtworkForm } from "@/features/gallery/hooks/useCreateArtworkForm";
import { MAX_CANVAS_DIMENSION } from "@/features/shared/artwork/artworkService";
import { createArtworkModal } from "./CreateArtworkModal.style";
import type { ICreateArtworkModalProps } from "./CreateArtworkModal.type";

export function CreateArtworkModal({ open, onClose, onCreate }: ICreateArtworkModalProps) {
  const {
    title,
    setTitle,
    width,
    setWidth,
    height,
    setHeight,
    backgroundColor,
    setBackgroundColor,
    busy,
    maxSizeHint,
    handleSubmit,
  } = useCreateArtworkForm({ onCreate });

  return (
    <Modal
      open={open}
      onClose={onClose}
      placement="center"
      size="md"
      overlayProps={{ "aria-labelledby": "create-artwork-heading" }}
    >
      <h2 id="create-artwork-heading" className={createArtworkModal.heading}>
        {gallery.create.title}
      </h2>
      <form className={createArtworkModal.form} onSubmit={handleSubmit}>
        <FormField label={gallery.create.titleLabel} htmlFor="create-artwork-title">
          <Input
            id="create-artwork-title"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
            required
          />
        </FormField>
        <div className={createArtworkModal.sizeFields}>
          <FormField label={shared.fields.width} htmlFor="create-artwork-width">
            <Input
              id="create-artwork-width"
              inputMode="numeric"
              min={1}
              max={MAX_CANVAS_DIMENSION}
              value={width}
              onChange={(ev) => setWidth(ev.target.value)}
              required
            />
          </FormField>
          <FormField label={shared.fields.height} htmlFor="create-artwork-height">
            <Input
              id="create-artwork-height"
              inputMode="numeric"
              min={1}
              max={MAX_CANVAS_DIMENSION}
              value={height}
              onChange={(ev) => setHeight(ev.target.value)}
              required
            />
          </FormField>
        </div>
        <FormField
          label={gallery.create.backgroundLabel}
          htmlFor="create-artwork-bg"
          hint={gallery.create.backgroundHint}
        >
          <div className={createArtworkModal.colorRow}>
            <input
              type="color"
              id="create-artwork-bg"
              value={backgroundColor}
              onChange={(ev) => setBackgroundColor(ev.target.value)}
              className={createArtworkModal.colorPicker}
              aria-label={gallery.create.backgroundAriaLabel}
            />
          </div>
        </FormField>
        <p className={createArtworkModal.maxSize}>{maxSizeHint}</p>
        <div className={createArtworkModal.actions}>
          <Button type="button" variant="ghost" onClick={onClose}>
            {shared.actions.cancel}
          </Button>
          <Button type="submit" disabled={busy}>
            {busy ? gallery.create.submitting : gallery.create.submit}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
