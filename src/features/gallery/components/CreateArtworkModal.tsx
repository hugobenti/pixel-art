/**
 * Purpose:
 * Modal dialog to create a new artwork with title, canvas size, and background color.
 */
"use client";

import { Button } from "@/features/shared/components/Button";
import { FormField } from "@/features/shared/components/FormField";
import { Input } from "@/features/shared/components/Input";
import { Modal } from "@/features/shared/components/Modal";
import { createArtworkModal } from "@/features/gallery/components/CreateArtworkModal.style";
import { useCreateArtworkForm } from "@/features/gallery/hooks/useCreateArtworkForm";

import type { CreateArtworkInput } from "@/features/shared/artwork/artworkService";
import { MAX_CANVAS_DIMENSION } from "@/features/shared/artwork/artworkService";

interface CreateArtworkModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (input: CreateArtworkInput) => Promise<unknown>;
}

export function CreateArtworkModal({
  open,
  onClose,
  onCreate,
}: CreateArtworkModalProps) {
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
    <Modal open={open} onClose={onClose} placement="center" size="md">
      <h2 className={createArtworkModal.title}>New artwork</h2>
      <form className={createArtworkModal.form} onSubmit={handleSubmit}>
        <FormField label="Title" htmlFor="create-artwork-title">
          <Input
            id="create-artwork-title"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
            required
          />
        </FormField>
        <div className={createArtworkModal.sizeGrid}>
          <FormField label="Width (px)" htmlFor="create-artwork-width">
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
          <FormField label="Height (px)" htmlFor="create-artwork-height">
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
          label="Background color"
          htmlFor="create-artwork-bg"
          hint="If this color is not in the default palette, it is added when the artwork is created."
        >
          <div className={createArtworkModal.colorRow}>
            <input
              type="color"
              id="create-artwork-bg"
              value={backgroundColor}
              onChange={(ev) => setBackgroundColor(ev.target.value)}
              className={createArtworkModal.colorPicker}
              aria-label="Canvas background color"
            />
          </div>
        </FormField>
        <p className={createArtworkModal.maxSizeHint}>
          Maximum {MAX_CANVAS_DIMENSION} × {MAX_CANVAS_DIMENSION} pixels.
        </p>
        <div className={createArtworkModal.actions}>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={busy}>
            {busy ? "Creating…" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
