/**
 * Purpose:
 * Classes for the shared ColorSwatch chip: footprint per density, selection rings, focus outline.
 */

export const colorSwatch = {
  density: {
    comfortable: "h-10 w-10 shrink-0 rounded-md",
    compact: "h-9 w-9 rounded-md",
  },
  ring: {
    idle: "ring-1 ring-zinc-300",
    selected: "ring-2 ring-blue-600 ring-offset-2 ring-offset-white",
    primary: "ring-2 ring-blue-600 ring-offset-2",
    secondary: "ring-2 ring-amber-500 ring-offset-2",
    primaryAndSecondary: "ring-2 ring-zinc-900 ring-offset-2",
  },
  focused: "outline outline-2 outline-offset-2 outline-dashed outline-zinc-500",
};
