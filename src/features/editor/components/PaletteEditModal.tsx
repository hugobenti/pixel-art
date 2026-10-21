/**
 * Purpose:
 * Modal for editing palette entries: pick swatch, change hex, add or remove colors.
 */
"use client";

import { useId, useState } from "react";

import { editor } from "@/content/editor";
import { shared } from "@/content/shared";
import { Button } from "@/features/shared/components/Button";
import { ColorSwatch } from "@/features/shared/components/ColorSwatch";
import { Modal } from "@/features/shared/components/Modal";

const titleClass = "text-lg font-semibold text-fg";

const swatchGridClass =
  "grid grid-cols-8 gap-2 sm:grid-cols-10";

const legendClass = "text-xs font-medium text-muted";

interface PaletteEditModalProps {
  open: boolean;
  onClose: () => void;
  palette: string[];
  focusedSwatchIndex: number;
  onSelectSwatch: (index: number) => void;
  onApplyHex: (index: number, hex: string) => void;
  onAddColor: (hex: string) => void;
  onRemoveSwatch: (index: number) => void;
  canRemoveSwatch: boolean;
  maxPaletteReached: boolean;
}

export function PaletteEditModal({
  open,
  onClose,
  palette,
  focusedSwatchIndex,
  onSelectSwatch,
  onApplyHex,
  onAddColor,
  onRemoveSwatch,
  canRemoveSwatch,
  maxPaletteReached,
}: PaletteEditModalProps) {
  const titleId = useId();
  const safeFocus = Math.min(
    Math.max(0, focusedSwatchIndex),
    Math.max(0, palette.length - 1)
  );
  const editHex = palette[safeFocus] ?? "#000000";

  return (
    <Modal
      open={open}
      onClose={onClose}
      placement="bottomSheet"
      size="lg"
      overlayProps={{ "aria-labelledby": titleId }}
    >
      <div className="flex items-start justify-between gap-3">
        <h2 id={titleId} className={titleClass}>
          {editor.paletteModal.title}
        </h2>
        <Button type="button" variant="ghost" onClick={onClose}>
          {shared.actions.close}
        </Button>
      </div>

      <div>
        <p className={legendClass}>{editor.paletteModal.swatches}</p>
        <div className={`${swatchGridClass} mt-2`}>
          {palette.map((color, index) => (
            <ColorSwatch
              key={`modal-swatch-${index}`}
              density="compact"
              color={color}
              index={index}
              selected={index === safeFocus}
              onClick={() => onSelectSwatch(index)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-line pt-4">
        <span className={legendClass}>{editor.paletteModal.selectedColor}</span>
        <label className="flex items-center gap-2 text-sm text-fg-secondary">
          <input
            type="color"
            value={editHex}
            onChange={(e) => onApplyHex(safeFocus, e.target.value)}
            className="h-10 w-12 cursor-pointer rounded border border-line-strong bg-surface p-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            aria-label={editor.paletteModal.selectedColorLabel}
          />
        </label>
        <Button
          type="button"
          variant="danger"
          disabled={!canRemoveSwatch}
          onClick={() => onRemoveSwatch(safeFocus)}
        >
          {shared.actions.remove}
        </Button>
      </div>

      <PaletteAddSection
        maxPaletteReached={maxPaletteReached}
        onAddColor={onAddColor}
      />
    </Modal>
  );
}

const addRowClass = "flex flex-wrap items-center gap-2";

function PaletteAddSection({
  maxPaletteReached,
  onAddColor,
}: {
  maxPaletteReached: boolean;
  onAddColor: (hex: string) => void;
}) {
  const [newHex, setNewHex] = useState("#808080");

  return (
    <div className="flex flex-col gap-2 border-t border-line pt-4">
      <span className={legendClass}>{editor.paletteModal.addColor}</span>
      <div className={addRowClass}>
        <input
          type="color"
          value={newHex}
          disabled={maxPaletteReached}
          onChange={(e) => setNewHex(e.target.value)}
          className="h-10 w-12 cursor-pointer rounded border border-line-strong bg-surface p-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50"
          aria-label={editor.paletteModal.newColorLabel}
        />
        <Button
          type="button"
          variant="ghost"
          disabled={maxPaletteReached}
          onClick={() => onAddColor(newHex)}
        >
          {shared.actions.add}
        </Button>
      </div>
      {maxPaletteReached ? (
        <p className="text-xs text-subtle">
          {editor.paletteModal.paletteFull}
        </p>
      ) : null}
    </div>
  );
}
