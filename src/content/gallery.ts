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
    backgroundHint:
      "If this color is not in the default palette, it is added when the artwork is created.",
    backgroundAriaLabel: "Canvas background color",
    maxSize: (max) => `Maximum ${max} × ${max} pixels.`,
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
