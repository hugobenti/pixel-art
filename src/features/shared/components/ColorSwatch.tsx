/**
 * Purpose:
 * Clickable color chip for dense palettes (editor strip or modal grid); density controls footprint.
 */
"use client";

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

const baseComfortable = "h-10 w-10 shrink-0 rounded-md";

const baseCompact = "h-9 w-9 rounded-md";

export function ColorSwatch(props: ColorSwatchProps) {
  const { color, index, onClick } = props;
  const n = index + 1;

  if (props.density === "compact") {
    const { selected } = props;
    const ring = selected
      ? "ring-2 ring-blue-600 ring-offset-2 ring-offset-white"
      : "ring-1 ring-zinc-300";
    return (
      <button
        type="button"
        title={`Color ${n}`}
        aria-label={`Select palette color ${n}`}
        aria-pressed={selected}
        className={`${baseCompact} ${ring}`}
        style={{ backgroundColor: color }}
        onClick={onClick}
      />
    );
  }

  const { isPrimary, isSecondary, isFocused } = props;
  let ring = "ring-1 ring-zinc-300";
  if (isPrimary && isSecondary) {
    ring = "ring-2 ring-zinc-900 ring-offset-2";
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
      type="button"
      role="listitem"
      title={`Palette ${n}`}
      aria-label={`Select palette color ${n}`}
      aria-current={isFocused ? "true" : undefined}
      className={`${baseComfortable} ${ring}${focusOutline}`}
      style={{ backgroundColor: color }}
      onClick={onClick}
    />
  );
}
