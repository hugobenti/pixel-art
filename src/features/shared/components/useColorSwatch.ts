/**
 * Purpose:
 * View model for ColorSwatch: 1-based labels and the selection ring to show.
 */

import type { ColorSwatchProps } from "@/features/shared/components/ColorSwatch";
import { colorSwatchRing } from "@/features/shared/logic/colorSwatchRing";

export function useColorSwatch(props: ColorSwatchProps) {
  const n = props.index + 1;
  return {
    title: props.density === "compact" ? `Color ${n}` : `Palette ${n}`,
    ariaLabel: `Select palette color ${n}`,
    ring: colorSwatchRing(props),
  };
}
