/**
 * Purpose:
 * Single horizontal row: scrollable palette swatches for the active primary/secondary slot.
 */
"use client";

const rowClass =
  "flex w-full min-w-0 items-center gap-2 border-b border-zinc-200 py-2";

const scrollerClass =
  "flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto py-1 [scrollbar-width:thin]";

const swatchBtnClass = "h-10 w-10 shrink-0 rounded-md";

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
        {palette.map((color, index) => {
          const isPrimary = index === primaryIndex;
          const isSecondary = index === secondaryIndex;
          const isFocused = index === safeFocus;

          let ring =
            "ring-1 ring-zinc-300";
          if (isPrimary && isSecondary) {
            ring =
              "ring-2 ring-zinc-900 ring-offset-2";
          } else if (isPrimary) {
            ring = "ring-2 ring-blue-600 ring-offset-2";
          } else if (isSecondary) {
            ring = "ring-2 ring-amber-500 ring-offset-2";
          }

          const focusOutline = isFocused
            ? " outline outline-2 outline-offset-2 outline-dashed outline-zinc-500"
            : "";

          return (
            <button
              key={`swatch-${index}`}
              type="button"
              role="listitem"
              title={`Palette ${index + 1}`}
              aria-label={`Select palette color ${index + 1}`}
              aria-current={isFocused ? "true" : undefined}
              className={`${swatchBtnClass} ${ring}${focusOutline}`}
              style={{ backgroundColor: color }}
              onClick={() => onSwatchPick(index)}
            />
          );
        })}
      </div>
    </div>
  );
}
