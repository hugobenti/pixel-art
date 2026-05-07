/**
 * Purpose:
 * Modal dialog to create a new artwork with title, canvas size, and background color.
 */
"use client";

import { Button } from "@/features/shared/components/Button";
import { Input } from "@/features/shared/components/Input";
import { useCreateArtworkForm } from "@/features/gallery/hooks/useCreateArtworkForm";

import type { CreateArtworkInput } from "@/features/gallery/services/galleryService";
import { MAX_CANVAS_DIMENSION } from "@/features/gallery/services/galleryService";

const overlayClass =
  "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm";

const panelClass =
  "flex w-full max-w-md flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-xl";

const colorFieldClass = "flex flex-col gap-1 text-sm text-zinc-700";

const colorRowClass = "flex flex-wrap items-center gap-3";

const colorPickerClass =
  "h-10 w-14 shrink-0 cursor-pointer rounded border border-zinc-300 bg-white p-1";

const colorHintClass = "text-xs text-zinc-500";

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

  if (!open) return null;

  return (
    <div className={overlayClass} role="dialog" aria-modal="true">
      <div className={panelClass}>
        <h2 className="text-lg font-semibold text-zinc-900">
          New artwork
        </h2>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-1 text-sm text-zinc-700">
            Title
            <Input
              value={title}
              onChange={(ev) => setTitle(ev.target.value)}
              required
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-sm text-zinc-700">
              Width (px)
              <Input
                inputMode="numeric"
                min={1}
                max={MAX_CANVAS_DIMENSION}
                value={width}
                onChange={(ev) => setWidth(ev.target.value)}
                required
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-zinc-700">
              Height (px)
              <Input
                inputMode="numeric"
                min={1}
                max={MAX_CANVAS_DIMENSION}
                value={height}
                onChange={(ev) => setHeight(ev.target.value)}
                required
              />
            </label>
          </div>
          <div className={colorFieldClass}>
            <span>Background color</span>
            <div className={colorRowClass}>
              <input
                type="color"
                value={backgroundColor}
                onChange={(ev) => setBackgroundColor(ev.target.value)}
                className={colorPickerClass}
                aria-label="Canvas background color"
              />
              <p className={colorHintClass}>
                If this color is not in the default palette, it is added when the artwork is
                created.
              </p>
            </div>
          </div>
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
      </div>
    </div>
  );
}
