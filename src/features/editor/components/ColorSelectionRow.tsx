/**
 * Purpose:
 * Single horizontal row: scrollable palette swatches plus an edit control after the last swatch.
 */
"use client";

import { colorSelectionRow } from "@/features/editor/components/ColorSelectionRow.style";
import { useColorSelectionRow } from "@/features/editor/components/useColorSelectionRow";
import { Button } from "@/features/shared/components/Button";
import { ColorSwatch } from "@/features/shared/components/ColorSwatch";

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
  const { swatches } = useColorSelectionRow({
    palette,
    primaryIndex,
    secondaryIndex,
    focusedSwatchIndex,
  });

  return (
    <div className={colorSelectionRow.base}>
      <div
        className={colorSelectionRow.scroller}
        role="group"
        aria-label="Palette colors and edit"
      >
        <div role="list" className={colorSelectionRow.swatchList}>
          {swatches.map((swatch) => (
            <ColorSwatch
              key={swatch.key}
              density="comfortable"
              color={swatch.color}
              index={swatch.index}
              isPrimary={swatch.isPrimary}
              isSecondary={swatch.isSecondary}
              isFocused={swatch.isFocused}
              onClick={() => onSwatchPick(swatch.index)}
            />
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          className={colorSelectionRow.editPaletteButton}
          onClick={onOpenPaletteModal}
        >
          Edit palette
        </Button>
      </div>
    </div>
  );
}
