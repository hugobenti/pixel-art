/**
 * Purpose:
 * Clickable color chip for dense palettes (editor strip or modal grid); density controls footprint.
 */
"use client";

import { shared } from "@/content/shared";

export type ColorSwatchDensity = "comfortable" | "compact";

interface ColorSwatchRowProps {
  density: "comfortable";
  color: string;
  index: number;
  isPrimary: boolean;
  isSecondary: boolean;
  isFocused: boolean;
  onClick: () => void;
}

interface ColorSwatchGridProps {
  density: "compact";
  color: string;
  index: number;
  selected: boolean;
  onClick: () => void;
}

export type ColorSwatchProps = ColorSwatchRowProps | ColorSwatchGridProps;

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

const baseComfortable = `h-10 w-10 shrink-0 rounded-md ${focusRing}`;

const baseCompact = `h-9 w-9 rounded-md ${focusRing}`;

export function ColorSwatch(props: ColorSwatchProps) {
  const { color, index, onClick } = props;
  const n = index + 1;

  if (props.density === "compact") {
    const { selected } = props;
    const ring = selected
      ? "ring-2 ring-pick-primary ring-offset-2 ring-offset-surface"
      : "ring-1 ring-line-strong";
    return (
      <button
        type="button"
        title={shared.colorSwatch.compactTitle(n)}
        aria-label={shared.colorSwatch.selectLabel(n, color)}
        aria-pressed={selected}
        className={`${baseCompact} ${ring}`}
        style={{ backgroundColor: color }}
        onClick={onClick}
      />
    );
  }

  const { isPrimary, isSecondary, isFocused } = props;
  let ring = "ring-1 ring-line-strong";
  if (isPrimary && isSecondary) {
    ring = "ring-2 ring-accent ring-offset-2";
  } else if (isPrimary) {
    ring = "ring-2 ring-pick-primary ring-offset-2";
  } else if (isSecondary) {
    ring = "ring-2 ring-pick-secondary ring-offset-2";
  }
  const focusOutline = isFocused
    ? " outline outline-2 outline-offset-2 outline-dashed outline-focus"
    : "";

  return (
    <button
      type="button"
      title={shared.colorSwatch.comfortableTitle(n)}
      aria-label={shared.colorSwatch.selectLabel(n, color, { primary: isPrimary, secondary: isSecondary })}
      aria-current={isFocused ? "true" : undefined}
      className={`${baseComfortable} ${ring}${focusOutline}`}
      style={{ backgroundColor: color }}
      onClick={onClick}
    />
  );
}
