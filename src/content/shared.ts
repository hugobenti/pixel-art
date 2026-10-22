import type { ISharedContent } from "./content.type";

export const shared: ISharedContent = {
  loading: "Loading…",
  actions: {
    save: "Save",
    cancel: "Cancel",
    apply: "Apply",
    close: "Close",
    add: "Add",
    remove: "Remove",
    rename: "Rename",
  },
  fields: {
    width: "Width (px)",
    height: "Height (px)",
  },
  toast: {
    dismissLabel: "Dismiss notification",
    dismissGlyph: "×",
  },
  sideDrawer: {
    closeLabel: "Close panel",
  },
  iconButton: {
    titleWithShortcut: (label, shortcut) => `${label} (${shortcut})`,
  },
  modal: {
    backdropLabel: "Close dialog",
  },
  theme: {
    label: "Theme",
    options: { system: "System", light: "Light", dark: "Dark" },
  },
  colorSwatch: {
    compactTitle: (position) => `Color ${position}`,
    comfortableTitle: (position) => `Palette ${position}`,
    selectLabel: (position, color, slots = {}) =>
      `Select palette color ${position} (${color})${slots.primary ? ", primary" : ""}${slots.secondary ? ", secondary" : ""}`,
  },
  artwork: {
    untitled: "Untitled",
    backgroundLayer: "Background",
    copyTitle: (title) => `${title} (copy)`,
    errors: {
      dimensionsOutOfRange: (max) => `Dimensions must be between 1 and ${max}.`,
      invalidBackgroundColor: "Invalid background color.",
      backgroundPaletteFull: "Cannot add background color: palette is full.",
      importedPaletteEmpty: "Imported palette is empty.",
      paletteTooLarge: (max) => `Palette cannot exceed ${max} colors.`,
    },
  },
  artworkFile: {
    errors: {
      invalidBase64: "Layer pixel data is not valid Base64.",
      invalidFormat: "Invalid file format.",
      unsupportedVersion: "Unsupported file version.",
      invalidTitle: "Invalid artwork title.",
      invalidDimensions: "Invalid artwork dimensions.",
      paletteMissing: "Artwork palette is missing.",
      invalidPaletteEntry: "Palette entries must be valid #RRGGBB strings.",
      layersMissing: "Artwork layers are missing.",
      layerInvalid: (position) => `Layer #${position} is invalid.`,
      layerInvalidId: (position) => `Layer #${position} has an invalid id.`,
      layerInvalidName: (position) => `Layer #${position} has an invalid name.`,
      layerMissingCompactData: (name) => `Layer "${name}" is missing compact pixel data.`,
      layerInvalidLength: (name) => `Layer "${name}" has invalid pixel data length.`,
      layerMissingPixelData: (name) => `Layer "${name}" is missing pixel data.`,
      layerPaletteOutOfRange: (name) => `Layer "${name}" has out-of-range palette indices.`,
      invalidReferenceImage: "Invalid reference image payload.",
      canvasUnavailable: "Unable to initialize canvas context.",
      invalidJson: "File is not valid JSON.",
    },
  },
};
