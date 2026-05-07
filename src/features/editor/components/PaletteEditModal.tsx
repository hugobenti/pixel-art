/**
 * Purpose:
 * Modal for editing palette entries: pick swatch, change hex, add or remove colors.
 */
"use client";

import { useEffect, useId, useState } from "react";

import { Button } from "@/features/shared/components/Button";

const overlayClass =
  "fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-4 backdrop-blur-sm sm:items-center";

const panelClass =
  "flex max-h-[85vh] w-full max-w-lg flex-col gap-4 overflow-y-auto rounded-xl border border-zinc-200 bg-white p-5 shadow-xl";

const titleClass =
  "text-lg font-semibold text-zinc-900";

const swatchGridClass =
  "grid grid-cols-8 gap-2 sm:grid-cols-10";

const legendClass = "text-xs font-medium text-zinc-600";

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

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className={overlayClass}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={panelClass}>
        <div className="flex items-start justify-between gap-3">
          <h2 id={titleId} className={titleClass}>
            Edit palette
          </h2>
          <Button type="button" variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>

        <div>
          <p className={legendClass}>Swatches</p>
          <div className={`${swatchGridClass} mt-2`}>
            {palette.map((color, index) => {
              const selected = index === safeFocus;
              return (
                <button
                  key={`modal-swatch-${index}`}
                  type="button"
                  title={`Color ${index + 1}`}
                  aria-label={`Select palette color ${index + 1}`}
                  aria-pressed={selected}
                  className={
                    selected
                      ? "h-9 w-9 rounded-md ring-2 ring-blue-600 ring-offset-2 ring-offset-white"
                      : "h-9 w-9 rounded-md ring-1 ring-zinc-300"
                  }
                  style={{ backgroundColor: color }}
                  onClick={() => onSelectSwatch(index)}
                />
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-zinc-200 pt-4">
          <span className={legendClass}>Selected color</span>
          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <input
              type="color"
              value={editHex}
              onChange={(e) => onApplyHex(safeFocus, e.target.value)}
              className="h-10 w-12 cursor-pointer rounded border border-zinc-300 bg-white p-1"
              aria-label="Color value for selected swatch"
            />
          </label>
          <Button
            type="button"
            variant="danger"
            disabled={!canRemoveSwatch}
            onClick={() => onRemoveSwatch(safeFocus)}
          >
            Remove
          </Button>
        </div>

        <PaletteAddSection
          maxPaletteReached={maxPaletteReached}
          onAddColor={onAddColor}
        />
      </div>
    </div>
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
    <div className="flex flex-col gap-2 border-t border-zinc-200 pt-4">
      <span className={legendClass}>Add new color</span>
      <div className={addRowClass}>
        <input
          type="color"
          value={newHex}
          disabled={maxPaletteReached}
          onChange={(e) => setNewHex(e.target.value)}
          className="h-10 w-12 cursor-pointer rounded border border-zinc-300 bg-white p-1 disabled:opacity-50"
          aria-label="Pick new color to append"
        />
        <Button
          type="button"
          variant="ghost"
          disabled={maxPaletteReached}
          onClick={() => onAddColor(newHex)}
        >
          Add
        </Button>
      </div>
      {maxPaletteReached ? (
        <p className="text-xs text-zinc-500">
          Palette full (256 colors maximum).
        </p>
      ) : null}
    </div>
  );
}
