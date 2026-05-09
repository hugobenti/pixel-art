/**
 * Purpose:
 * Modal dialog to create a new artwork with title, canvas size, and background color.
 */
"use client";

import { Button } from "@/features/shared/components/Button";
import { FormField } from "@/features/shared/components/FormField";
import { Input } from "@/features/shared/components/Input";
import { Modal } from "@/features/shared/components/Modal";
import { useCreateArtworkForm } from "@/features/gallery/hooks/useCreateArtworkForm";

import type { CreateArtworkInput } from "@/features/gallery/services/galleryService";
import { MAX_CANVAS_DIMENSION } from "@/features/gallery/services/galleryService";

const colorRowClass = "flex flex-wrap items-center gap-3";

const colorPickerClass =
  "h-10 w-14 shrink-0 cursor-pointer rounded border border-zinc-300 bg-white p-1";

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

  const bgHint =
    "If this color is not in the default palette, it is added when the artwork is created.";

  return (
    <Modal open={open} onClose={onClose} placement="center" size="md">
      <h2 className="text-lg font-semibold text-zinc-900">New artwork</h2>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <FormField label="Title" htmlFor="create-artwork-title">
          <Input
            id="create-artwork-title"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
            required
          />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
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
          hint={bgHint}
        >
          <div className={colorRowClass}>
            <input
              type="color"
              id="create-artwork-bg"
              value={backgroundColor}
              onChange={(ev) => setBackgroundColor(ev.target.value)}
              className={colorPickerClass}
              aria-label="Canvas background color"
            />
          </div>
        </FormField>
        <p className="text-xs text-zinc-500">
          Maximum {MAX_CANVAS_DIMENSION} × {MAX_CANVAS_DIMENSION} pixels.
        </p>
        <div className="mt-2 flex justify-end gap-2">
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
