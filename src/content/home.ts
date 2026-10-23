import type { IHomeContent } from "./content.type";

export const home: IHomeContent = {
  metaTitle: { absolute: "PixelHB · Pixel art, right in your browser" },
  h1: "Pixel art, right in your browser.",
  lead: "Draw sprites, icons and tiles with layers, a reference image and your own palette. No account, no install.",
  primary: "Start drawing",
  secondary: "Read the guide",
  promises: [
    {
      title: "Open it and draw",
      text: "No sign-up and no download. Pick a canvas size and start.",
    },
    {
      title: "Stays on your device",
      text: "Your artworks save automatically in this browser. Nothing is uploaded.",
    },
    {
      title: "Ready for your game",
      text: "Export crisp PNGs up to 1000 × 1000 pixels, with palettes of up to 256 colors.",
    },
  ],
  insideLabel: "What’s inside",
  inside: [
    "Layers",
    "Reference image",
    "Palettes up to 256 colors",
    "Fill",
    "Shift pixels",
    "Pixel grid and center guides",
    "Undo and redo",
    "PNG export",
  ],
  stepsTitle: "How it works",
  steps: [
    { title: "Create a canvas", text: "Choose any size up to 1000 × 1000." },
    {
      title: "Draw",
      text: "Pixel by pixel, with fill, layers and a reference image, using a mouse, a trackpad or your finger.",
    },
    { title: "Export", text: "Download a crisp PNG, ready for your game or your portfolio." },
  ],
  storageNote:
    "Your artworks live in this browser only, so clearing your browsing data deletes them.",
  storageLink: "Where your work is saved",
  closingTitle: "Ready to draw?",
  closingCta: "Start drawing",
};
