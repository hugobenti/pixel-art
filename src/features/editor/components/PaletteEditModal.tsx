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
import { ConfirmDialog } from "@/features/shared/components/ConfirmDialog";
import { Modal } from "@/features/shared/components/Modal";
import { PaletteReplacementPicker } from "./PaletteReplacementPicker";
import { paletteEditModal } from "./PaletteEditModal.style";
import type { IPaletteEditModalProps } from "./PaletteEditModal.type";
import { usePaletteEditModal } from "./usePaletteEditModal";

export function PaletteEditModal(props: IPaletteEditModalProps) {
  const { open, onClose, palette, onSelectSwatch, canRemoveSwatch, maxPaletteReached } = props;
  const {
    focusedIndex,
    editHex,
    applyEditHex,
    removeFocused,
    removal,
    newHex,
    setNewHex,
    changeNewColorValidity,
    addNote,
    addDisabled,
    newColorFieldKey,
    addNewColor,
  } = usePaletteEditModal(props);

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
            key={newColorFieldKey}
            label={editor.paletteModal.newColorLabel}
            hideLabel
            value={newHex}
            disabled={maxPaletteReached}
            onValueChange={setNewHex}
            onValidityChange={changeNewColorValidity}
          />
          <Button
            type="button"
            variant="outline"
            disabled={addDisabled}
            onClick={addNewColor}
          >
            {editor.paletteModal.addButton}
          </Button>
        </div>
        {addNote ? <p className={paletteEditModal.fullNote}>{addNote}</p> : null}
      </fieldset>
      <ConfirmDialog {...removal.dialog}>
        <PaletteReplacementPicker
          choices={removal.choices}
          replacementIndex={removal.replacementIndex}
          onChoose={removal.chooseReplacement}
        />
      </ConfirmDialog>
    </Modal>
  );
}
