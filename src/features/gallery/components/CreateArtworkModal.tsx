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
import type { ICreateArtworkModalProps } from "./CreateArtworkModal.type";

const colorRowClass = "flex flex-wrap items-center gap-3";

const colorPickerClass =
  "h-10 w-14 shrink-0 cursor-pointer rounded border border-line-strong bg-surface p-1";

export function CreateArtworkModal({
  open,
  onClose,
  onCreate,
}: ICreateArtworkModalProps) {
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
      <h2 id="create-artwork-heading" className="text-lg font-semibold text-fg">
        {gallery.create.title}
      </h2>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <FormField label={gallery.create.titleLabel} htmlFor="create-artwork-title">
          <Input
            id="create-artwork-title"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
            required
          />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
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
          <div className={colorRowClass}>
            <input
              type="color"
              id="create-artwork-bg"
              value={backgroundColor}
              onChange={(ev) => setBackgroundColor(ev.target.value)}
              className={colorPickerClass}
              aria-label={gallery.create.backgroundAriaLabel}
            />
          </div>
        </FormField>
        <p className="text-xs text-subtle">
          {gallery.create.maxSize(MAX_CANVAS_DIMENSION)}
        </p>
        <div className="mt-2 flex justify-end gap-2">
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
