import type { IGalleryContent } from "./content.type";

export const gallery: IGalleryContent = {
  screen: {
    title: "Gallery",
    intro: "Local artworks stored in your browser (IndexedDB).",
    importJson: "Import JSON",
    newArtwork: "New artwork",
  },
  grid: {
    empty: "No artworks yet. Create one to get started.",
  },
  card: {
    clone: "Clone",
    delete: "Delete",
    confirmDelete: "Delete this artwork permanently?",
    titleLabel: "Artwork title",
  },
  create: {
    title: "New artwork",
    titleLabel: "Title",
    backgroundLabel: "Background color",
    sizeLabel: "Canvas size",
    sizePresetsLabel: "Size presets",
    sizePresetLabel: (size) => `${size} × ${size} pixels`,
    hint: (max) =>
      `Up to ${max} × ${max} px. A background color not in the palette is added to it.`,
    submit: "Create",
    submitting: "Creating…",
  },
  import: {
    success: "Artwork imported.",
    failed: "Could not import JSON file.",
  },
  errors: {
    load: "Failed to load gallery.",
    create: "Could not create artwork.",
    import: "Could not import artwork.",
    rename: "Rename failed.",
    clone: "Clone failed.",
    delete: "Delete failed.",
  },
};
