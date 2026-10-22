/**
 * Purpose:
 * Modal for editing palette entries: pick a swatch, change its color (picker or hex), remove it, or
 * add a new color.
 */
"use client";

import { editor } from "@/content/editor";
import { shared } from "@/content/shared";
import { Button } from "@/features/shared/components/Button";
import { ColorField } from "@/features/shared/components/ColorField";
import { ColorSwatch } from "@/features/shared/components/ColorSwatch";
import { Modal } from "@/features/shared/components/Modal";
import { paletteEditModal } from "./PaletteEditModal.style";
import type { IPaletteEditModalProps } from "./PaletteEditModal.type";
import { usePaletteEditModal } from "./usePaletteEditModal";

export function PaletteEditModal(props: IPaletteEditModalProps) {
  const { open, onClose, palette, onSelectSwatch, canRemoveSwatch, maxPaletteReached } = props;
  const { focusedIndex, editHex, applyEditHex, removeFocused, newHex, setNewHex, addNewColor } =
    usePaletteEditModal(props);

  return (
    <Modal open={open} onClose={onClose} title={editor.paletteModal.title} size="lg">
      <fieldset className={paletteEditModal.section}>
        <legend className={paletteEditModal.legend}>{editor.paletteModal.swatches}</legend>
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
      </fieldset>

      <fieldset className={paletteEditModal.section}>
        <legend className={paletteEditModal.legend}>{editor.paletteModal.selectedColor}</legend>
        <div className={paletteEditModal.row}>
          <ColorField
            label={editor.paletteModal.selectedColorLabel}
            hideLabel
            value={editHex}
            onValueChange={applyEditHex}
          />
          <Button
            type="button"
            variant="danger"
            disabled={!canRemoveSwatch}
            onClick={removeFocused}
          >
            {shared.actions.remove}
          </Button>
        </div>
      </fieldset>

      <fieldset className={paletteEditModal.section}>
        <legend className={paletteEditModal.legend}>{editor.paletteModal.addColor}</legend>
        <div className={paletteEditModal.row}>
          <ColorField
            label={editor.paletteModal.newColorLabel}
            hideLabel
            value={newHex}
            disabled={maxPaletteReached}
            onValueChange={setNewHex}
          />
          <Button
            type="button"
            variant="outline"
            disabled={maxPaletteReached}
            onClick={addNewColor}
          >
            {editor.paletteModal.addButton}
          </Button>
        </div>
        {maxPaletteReached ? (
          <p className={paletteEditModal.fullNote}>{editor.paletteModal.paletteFull}</p>
        ) : null}
      </fieldset>
    </Modal>
  );
}
