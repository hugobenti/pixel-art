/**
 * Purpose:
 * Modal for editing palette entries: pick swatch, change hex, add or remove colors.
 */
"use client";

import { editor } from "@/content/editor";
import { shared } from "@/content/shared";
import { Button } from "@/features/shared/components/Button";
import { ColorSwatch } from "@/features/shared/components/ColorSwatch";
import { Modal } from "@/features/shared/components/Modal";
import { paletteEditModal } from "./PaletteEditModal.style";
import type { IPaletteEditModalProps } from "./PaletteEditModal.type";
import { usePaletteEditModal } from "./usePaletteEditModal";

export function PaletteEditModal(props: IPaletteEditModalProps) {
  const { open, onClose, palette, onSelectSwatch, canRemoveSwatch, maxPaletteReached } = props;
  const { focusedIndex, editHex, applyEditHex, removeFocused, newHex, changeNewHex, addNewColor } =
    usePaletteEditModal(props);

  return (
    <Modal open={open} onClose={onClose} title={editor.paletteModal.title} size="lg">
      <div>
        <p className={paletteEditModal.legend}>{editor.paletteModal.swatches}</p>
        <div className={paletteEditModal.swatchGrid}>
          {palette.map((color, index) => (
            <ColorSwatch
              key={index}
              density="compact"
              color={color}
              index={index}
              selected={index === focusedIndex}
              onClick={() => onSelectSwatch(index)}
            />
          ))}
        </div>
      </div>

      <div className={paletteEditModal.selectedRow}>
        <span className={paletteEditModal.legend}>{editor.paletteModal.selectedColor}</span>
        <label className={paletteEditModal.colorLabel}>
          <input
            type="color"
            value={editHex}
            onChange={applyEditHex}
            className={paletteEditModal.colorInput}
            aria-label={editor.paletteModal.selectedColorLabel}
          />
        </label>
        <Button type="button" variant="danger" disabled={!canRemoveSwatch} onClick={removeFocused}>
          {shared.actions.remove}
        </Button>
      </div>

      <div className={paletteEditModal.addSection}>
        <span className={paletteEditModal.legend}>{editor.paletteModal.addColor}</span>
        <div className={paletteEditModal.addRow}>
          <input
            type="color"
            value={newHex}
            disabled={maxPaletteReached}
            onChange={changeNewHex}
            className={paletteEditModal.newColorInput}
            aria-label={editor.paletteModal.newColorLabel}
          />
          <Button type="button" variant="ghost" disabled={maxPaletteReached} onClick={addNewColor}>
            {shared.actions.add}
          </Button>
        </div>
        {maxPaletteReached ? (
          <p className={paletteEditModal.fullNote}>{editor.paletteModal.paletteFull}</p>
        ) : null}
      </div>
    </Modal>
  );
}
