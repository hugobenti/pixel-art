/**
 * Purpose:
 * Modal for editing palette entries: pick swatch, change hex, add or remove colors.
 */
"use client";

import { Button } from "@/features/shared/components/Button";
import { ColorSwatch } from "@/features/shared/components/ColorSwatch";
import { Modal } from "@/features/shared/components/Modal";

import { paletteEditModal } from "@/features/editor/components/PaletteEditModal.style";
import {
  usePaletteAddSection,
  usePaletteEditModal,
} from "@/features/editor/components/usePaletteEditModal";

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
  const { titleId, safeFocus, editHex, swatches } = usePaletteEditModal({
    palette,
    focusedSwatchIndex,
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      placement="bottomSheet"
      size="lg"
      overlayProps={{ "aria-labelledby": titleId }}
    >
      <div className={paletteEditModal.header}>
        <h2 id={titleId} className={paletteEditModal.title}>
          Edit palette
        </h2>
        <Button type="button" variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>

      <div>
        <p className={paletteEditModal.legend}>Swatches</p>
        <div className={paletteEditModal.swatchGrid}>
          {swatches.map((swatch) => (
            <ColorSwatch
              key={swatch.key}
              density="compact"
              color={swatch.color}
              index={swatch.index}
              selected={swatch.selected}
              onClick={() => onSelectSwatch(swatch.index)}
            />
          ))}
        </div>
      </div>

      <div className={paletteEditModal.selectedRow}>
        <span className={paletteEditModal.legend}>Selected color</span>
        <label className={paletteEditModal.colorLabel}>
          <input
            type="color"
            value={editHex}
            onChange={(e) => onApplyHex(safeFocus, e.target.value)}
            className={paletteEditModal.editColorInput}
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
    </Modal>
  );
}

function PaletteAddSection({
  maxPaletteReached,
  onAddColor,
}: {
  maxPaletteReached: boolean;
  onAddColor: (hex: string) => void;
}) {
  const { newHex, setNewHex } = usePaletteAddSection();

  return (
    <div className={paletteEditModal.addSection}>
      <span className={paletteEditModal.legend}>Add new color</span>
      <div className={paletteEditModal.addRow}>
        <input
          type="color"
          value={newHex}
          disabled={maxPaletteReached}
          onChange={(e) => setNewHex(e.target.value)}
          className={paletteEditModal.addColorInput}
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
        <p className={paletteEditModal.fullHint}>
          Palette full (256 colors maximum).
        </p>
      ) : null}
    </div>
  );
}
