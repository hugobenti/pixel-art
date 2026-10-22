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
    errors,
    widthRef,
    heightRef,
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
          <FormField
            label={shared.fields.width}
            htmlFor="create-artwork-width"
            error={errors.width}
            errorId="create-artwork-width-error"
          >
            <Input
              ref={widthRef}
              id="create-artwork-width"
              inputMode="numeric"
              aria-invalid={errors.width ? true : undefined}
              aria-describedby={errors.width ? "create-artwork-width-error" : undefined}
              value={width}
              onChange={(ev) => setWidth(ev.target.value)}
              required
            />
          </FormField>
          <FormField
            label={shared.fields.height}
            htmlFor="create-artwork-height"
            error={errors.height}
            errorId="create-artwork-height-error"
          >
            <Input
              ref={heightRef}
              id="create-artwork-height"
              inputMode="numeric"
              aria-invalid={errors.height ? true : undefined}
              aria-describedby={errors.height ? "create-artwork-height-error" : undefined}
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
        {errors.form ? (
          <p role="alert" className={createArtworkModal.formError}>
            {errors.form}
          </p>
        ) : null}
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
