/**
 * Purpose:
 * Single horizontal row: scrollable palette swatches plus an edit control after the last swatch.
 */
"use client";

import { editor } from "@/content/editor";
import { Button } from "@/features/shared/components/Button";
import { ColorSwatch } from "@/features/shared/components/ColorSwatch";
import type { IColorSelectionRowProps } from "./ColorSelectionRow.type";

const rowClass =
  "flex w-full min-w-0 items-center gap-2 border-b border-line py-2";

const scrollerClass =
  "flex min-w-0 flex-1 items-center gap-2 overflow-x-auto py-1 [scrollbar-width:thin]";

const swatchListClass = "flex items-center gap-1.5";

const editPaletteButtonClass =
  "shrink-0 touch-manipulation whitespace-nowrap px-3 py-2 text-sm";

export function ColorSelectionRow({
  palette,
  primaryIndex,
  secondaryIndex,
  focusedSwatchIndex,
  onSwatchPick,
  onOpenPaletteModal,
}: IColorSelectionRowProps) {
  const safeFocus = Math.min(
    Math.max(0, focusedSwatchIndex),
    Math.max(0, palette.length - 1)
  );

  return (
    <div className={rowClass}>
      <div
        className={scrollerClass}
        role="group"
        aria-label={editor.paletteRow.groupLabel}
      >
        <ul className={swatchListClass}>
          {palette.map((color, index) => (
            <li key={`swatch-${index}`}>
              <ColorSwatch
                density="comfortable"
                color={color}
                index={index}
                isPrimary={index === primaryIndex}
                isSecondary={index === secondaryIndex}
                isFocused={index === safeFocus}
                onClick={() => onSwatchPick(index)}
              />
            </li>
          ))}
        </ul>
        <Button
          type="button"
          variant="outline"
          className={editPaletteButtonClass}
          onClick={onOpenPaletteModal}
        >
          {editor.paletteRow.edit}
        </Button>
      </div>
    </div>
  );
}
