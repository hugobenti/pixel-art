/**
 * Purpose:
 * Tailwind class maps for the shared Modal shell (placement, size, z-index, backdrop).
 */

export type ModalPlacement = "center" | "bottomSheet";

export type ModalSize = "sm" | "md" | "lg";

export type ModalLayer = "default" | "elevated";

const placementOverlay: Record<ModalPlacement, string> = {
  center: "flex items-center justify-center",
  bottomSheet: "flex items-end justify-center sm:items-center",
};

const layerZ: Record<ModalLayer, string> = {
  default: "z-50",
  elevated: "z-[60]",
};

const sizePanel: Record<ModalSize, string> = {
  sm: "w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-4 shadow-lg",
  md: "flex w-full max-w-md flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-xl",
  lg: "flex max-h-[85vh] w-full max-w-lg flex-col gap-4 overflow-y-auto rounded-xl border border-zinc-200 bg-white p-5 shadow-xl",
};

export function modalOverlayClasses(options: {
  placement: ModalPlacement;
  layer: ModalLayer;
  backdropBlur: boolean;
  extra?: string;
}): string {
  const blur = options.backdropBlur ? "backdrop-blur-sm" : "";
  const parts = [
    "fixed inset-0",
    layerZ[options.layer],
    placementOverlay[options.placement],
    "bg-black/40",
    "p-4",
    blur,
    options.extra?.trim(),
  ];
  return parts.filter(Boolean).join(" ");
}

export function modalPanelClasses(
  size: ModalSize,
  panelClassName?: string
): string {
  const extra = panelClassName?.trim();
  return extra ? `${sizePanel[size]} ${extra}` : sizePanel[size];
}
