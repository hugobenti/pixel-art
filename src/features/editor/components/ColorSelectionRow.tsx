/**
 * Purpose:
 * Single horizontal row: scrollable palette swatches plus an edit control after the last swatch.
 */
"use client";

import { Button } from "@/features/shared/components/Button";
import { ColorSwatch } from "@/features/shared/components/ColorSwatch";

const rowClass =
  "flex w-full min-w-0 items-center gap-2 border-b border-zinc-200 py-2";

const scrollerClass =
  "flex min-w-0 flex-1 items-center gap-2 overflow-x-auto py-1 [scrollbar-width:thin]";

const swatchListClass = "flex items-center gap-1.5";

const editPaletteButtonClass =
  "shrink-0 touch-manipulation whitespace-nowrap px-3 py-2 text-sm";

interface ColorSelectionRowProps {
  palette: string[];
  primaryIndex: number;
  secondaryIndex: number;
  focusedSwatchIndex: number;
  onSwatchPick: (index: number) => void;
  onOpenPaletteModal: () => void;
}

export function ColorSelectionRow({
  palette,
  primaryIndex,
  secondaryIndex,
  focusedSwatchIndex,
  onSwatchPick,
  onOpenPaletteModal,
}: ColorSelectionRowProps) {
  const safeFocus = Math.min(
    Math.max(0, focusedSwatchIndex),
    Math.max(0, palette.length - 1)
  );

  return (
    <div className={rowClass}>
      <div
        className={scrollerClass}
        role="group"
        aria-label="Palette colors and edit"
      >
        <div role="list" className={swatchListClass}>
          {palette.map((color, index) => (
            <ColorSwatch
              key={`swatch-${index}`}
              density="comfortable"
              color={color}
              index={index}
              isPrimary={index === primaryIndex}
              isSecondary={index === secondaryIndex}
              isFocused={index === safeFocus}
              onClick={() => onSwatchPick(index)}
            />
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          className={editPaletteButtonClass}
          onClick={onOpenPaletteModal}
        >
          Edit palette
        </Button>
      </div>
    </div>
  );
}
