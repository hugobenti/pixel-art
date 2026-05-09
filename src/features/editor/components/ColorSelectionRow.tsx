/**
 * Purpose:
 * Single horizontal row: scrollable palette swatches for the active primary/secondary slot.
 */
"use client";

import { ColorSwatch } from "@/features/shared/components/ColorSwatch";

const rowClass =
  "flex w-full min-w-0 items-center gap-2 border-b border-zinc-200 py-2";

const scrollerClass =
  "flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto py-1 [scrollbar-width:thin]";

interface ColorSelectionRowProps {
  palette: string[];
  primaryIndex: number;
  secondaryIndex: number;
  focusedSwatchIndex: number;
  onSwatchPick: (index: number) => void;
}

export function ColorSelectionRow({
  palette,
  primaryIndex,
  secondaryIndex,
  focusedSwatchIndex,
  onSwatchPick,
}: ColorSelectionRowProps) {
  const safeFocus = Math.min(
    Math.max(0, focusedSwatchIndex),
    Math.max(0, palette.length - 1)
  );

  return (
    <div className={rowClass}>
      <div className={scrollerClass} role="list">
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
    </div>
  );
}
