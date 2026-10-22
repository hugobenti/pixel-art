/**
 * Purpose:
 * Choice of what a removed color's pixels become: transparent or one of the remaining palette colors.
 */
"use client";

import { editor } from "@/content/editor";
import { ColorSwatch } from "@/features/shared/components/ColorSwatch";
import { cx } from "@/features/shared/utils/cx";
import { paletteReplacementPicker } from "./PaletteReplacementPicker.style";
import type { IPaletteReplacementPickerProps } from "./PaletteReplacementPicker.type";

export function PaletteReplacementPicker({
  choices,
  replacementIndex,
  onChoose,
}: IPaletteReplacementPickerProps) {
  const transparentSelected = replacementIndex === null;

  return (
    <fieldset className={paletteReplacementPicker.section}>
      <legend className={paletteReplacementPicker.legend}>
        {editor.paletteRemoval.dialog.replaceWith}
      </legend>
      <div className={paletteReplacementPicker.grid}>
        <button
          type="button"
          title={editor.paletteRemoval.dialog.transparent}
          aria-label={editor.paletteRemoval.dialog.transparent}
          aria-pressed={transparentSelected}
          className={cx(
            paletteReplacementPicker.transparent.base,
            transparentSelected
              ? paletteReplacementPicker.transparent.selected
              : paletteReplacementPicker.transparent.idle,
          )}
          onClick={() => onChoose(null)}
        />
        {choices.map(({ color, index }) => (
          <ColorSwatch
            key={index}
            density="compact"
            color={color}
            index={index}
            selected={index === replacementIndex}
            onClick={() => onChoose(index)}
          />
        ))}
      </div>
    </fieldset>
  );
}
