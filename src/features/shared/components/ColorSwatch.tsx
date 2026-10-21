/**
 * Purpose:
 * Clickable color chip for dense palettes (editor strip or modal grid); density controls footprint.
 */
"use client";

import { colorSwatch } from "@/features/shared/components/ColorSwatch.style";
import { useColorSwatch } from "@/features/shared/components/useColorSwatch";
import { cx } from "@/features/shared/utils/cx";

export type ColorSwatchDensity = keyof typeof colorSwatch.density;

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

export function ColorSwatch(props: ColorSwatchProps) {
  const { color, onClick } = props;
  const { title, ariaLabel, ring } = useColorSwatch(props);

  if (props.density === "compact") {
    return (
      <button
        type="button"
        title={title}
        aria-label={ariaLabel}
        aria-pressed={props.selected}
        className={cx(colorSwatch.density.compact, colorSwatch.ring[ring])}
        style={{ backgroundColor: color }}
        onClick={onClick}
      />
    );
  }

  return (
    <button
      type="button"
      role="listitem"
      title={title}
      aria-label={ariaLabel}
      aria-current={props.isFocused ? "true" : undefined}
      className={cx(
        colorSwatch.density.comfortable,
        colorSwatch.ring[ring],
        props.isFocused && colorSwatch.focused
      )}
      style={{ backgroundColor: color }}
      onClick={onClick}
    />
  );
}
