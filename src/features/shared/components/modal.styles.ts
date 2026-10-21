/**
 * Purpose:
 * Tailwind class maps for the shared Modal shell (placement, size, z-index, backdrop).
 */

import type { TModalPlacement, TModalSize, TModalLayer } from "./modal.styles.type";

const placementOverlay: Record<TModalPlacement, string> = {
  center: "flex items-center justify-center",
  bottomSheet: "flex items-end justify-center sm:items-center",
};

const layerZ: Record<TModalLayer, string> = {
  default: "z-50",
  elevated: "z-[60]",
};

const sizePanel: Record<TModalSize, string> = {
  sm: "relative w-full max-w-sm rounded-xl border border-line bg-surface p-4 shadow-lg",
  md: "relative flex w-full max-w-md flex-col gap-4 rounded-xl border border-line bg-surface p-6 shadow-xl",
  lg: "relative flex max-h-[85vh] w-full max-w-lg flex-col gap-4 overflow-y-auto rounded-xl border border-line bg-surface p-5 shadow-xl",
};

/** Full-overlay dismiss target behind the panel (pointer only; Escape covers keyboard). */
export const modalBackdropClass = "absolute inset-0 cursor-default";

export function modalOverlayClasses(options: {
  placement: TModalPlacement;
  layer: TModalLayer;
  backdropBlur: boolean;
  extra?: string;
}): string {
  const blur = options.backdropBlur ? "backdrop-blur-sm" : "";
  const parts = [
    "fixed inset-0",
    layerZ[options.layer],
    placementOverlay[options.placement],
    "bg-scrim/40",
    "p-4",
    blur,
    options.extra?.trim(),
  ];
  return parts.filter(Boolean).join(" ");
}

export function modalPanelClasses(
  size: TModalSize,
  panelClassName?: string
): string {
  const extra = panelClassName?.trim();
  return extra ? `${sizePanel[size]} ${extra}` : sizePanel[size];
}
