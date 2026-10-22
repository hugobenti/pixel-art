/**
 * Purpose:
 * Modal dialog to create a new artwork with title, canvas size (square presets or width and height),
 * and background color.
 */
"use client";

import { gallery } from "@/content/gallery";
import { shared } from "@/content/shared";
import { Button } from "@/features/shared/components/Button";
import { ButtonGroup } from "@/features/shared/components/ButtonGroup";
import { FormField } from "@/features/shared/components/FormField";
import { Input } from "@/features/shared/components/Input";
import { Modal } from "@/features/shared/components/Modal";
import { NumberField } from "@/features/shared/components/NumberField";
import { useCreateArtworkForm } from "@/features/gallery/hooks/useCreateArtworkForm";
import { createArtworkModal } from "./CreateArtworkModal.style";
import type { ICreateArtworkModalProps } from "./CreateArtworkModal.type";

export function CreateArtworkModal({ open, onClose, onCreate }: ICreateArtworkModalProps) {
  const {
    title,
    setTitle,
    width,
    changeWidth,
    height,
    changeHeight,
    presets,
    backgroundColor,
    setBackgroundColor,
    busy,
    errors,
    widthRef,
    heightRef,
    maxDimension,
    hint,
    handleSubmit,
  } = useCreateArtworkForm({ onCreate });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={gallery.create.title}
      size="md"
      onSubmit={handleSubmit}
      footer={
        <>
          <Button type="button" variant="ghost" onClick={onClose}>
            {shared.actions.cancel}
          </Button>
          <Button type="submit" disabled={busy}>
            {busy ? gallery.create.submitting : gallery.create.submit}
          </Button>
        </>
      }
    >
      <FormField label={gallery.create.titleLabel} htmlFor="create-artwork-title">
        <Input
          id="create-artwork-title"
          data-autofocus
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
          required
        />
      </FormField>
      <fieldset className={createArtworkModal.sizeGroup}>
        <legend className={createArtworkModal.legend}>{gallery.create.sizeLabel}</legend>
        <ButtonGroup
          aria-label={gallery.create.sizePresetsLabel}
          className={createArtworkModal.presets}
        >
          {presets.map((preset) => (
            <button
              key={preset.size}
              type="button"
              aria-pressed={preset.pressed}
              aria-label={preset.label}
              className={createArtworkModal.preset}
              onClick={preset.apply}
            >
              {preset.size}
            </button>
          ))}
        </ButtonGroup>
        <div className={createArtworkModal.sizeFields}>
          <NumberField
            ref={widthRef}
            label={shared.fields.width}
            name="width"
            min={1}
            max={maxDimension}
            value={width}
            onChange={(ev) => changeWidth(ev.target.value)}
            error={errors.width}
          />
          <NumberField
            ref={heightRef}
            label={shared.fields.height}
            name="height"
            min={1}
            max={maxDimension}
            value={height}
            onChange={(ev) => changeHeight(ev.target.value)}
            error={errors.height}
          />
        </div>
      </fieldset>
      <FormField label={gallery.create.backgroundLabel} htmlFor="create-artwork-bg">
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
      <p className={createArtworkModal.hint}>{hint}</p>
      {errors.form ? (
        <p role="alert" className={createArtworkModal.formError}>
          {errors.form}
        </p>
      ) : null}
    </Modal>
  );
}
