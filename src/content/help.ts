import type { IHelpContent } from "./content.type";

export const help: IHelpContent = {
  metaTitle: "Help",
  metaDescription: "How to create, save, export and draw with PixelHB, plus its keyboard shortcuts.",
  h1: "Help",
  intro: "Everything you need to start drawing, and where your work lives.",
  sections: [
    {
      id: "getting-started",
      title: "Getting started",
      paragraphs: [
        "Open your gallery and choose New artwork. Name it, pick a size (presets from 16 × 16 to 128 × 128, or type any size up to 1000 × 1000) and a background color. The editor opens right away.",
      ],
    },
    {
      id: "saving",
      title: "Where your work is saved",
      paragraphs: [
        "PixelHB saves every change automatically in this browser. There's no account, and nothing is uploaded.",
        "Your artworks stay in this browser on this device. Clearing your browsing data deletes them, and they don't show up in a private window, another browser or another device.",
        "To keep a copy or move an artwork, open it, go to Settings › Export and choose Export JSON. Open that file later with Import file in your gallery.",
      ],
    },
    {
      id: "export-png",
      title: "Exporting a PNG",
      paragraphs: [
        "In the editor, open Settings › Export and choose Export PNG to download an image of the visible layers.",
      ],
    },
    {
      id: "phone",
      title: "On a phone",
      paragraphs: [
        "Pinch with two fingers to zoom. Turn on Pan mode in the toolbar to move around with one finger, and turn it off to draw again.",
      ],
    },
    {
      id: "limits",
      title: "Limits",
      paragraphs: [
        "Canvases go up to 1000 × 1000 pixels, and each artwork's palette holds up to 256 colors.",
      ],
    },
  ],
  shortcutsTitle: "Keyboard shortcuts",
  shortcutsIntro: "These work in the editor on a computer.",
  shortcutColumns: { action: "Action", keys: "Keys" },
  keyNames: { ctrl: "Ctrl", shift: "Shift", space: "Space", arrows: "Arrow keys" },
  shortcuts: [
    { action: "Undo", combo: { key: "z", mod: true }, effect: "undo" },
    { action: "Redo", combo: { key: "z", mod: true, shift: true }, effect: "redo" },
    { action: "Show or hide the pixel grid", combo: { key: "g" }, effect: "toggleGrid" },
    { action: "Pan while dragging", combo: { key: "Space" }, effect: "spacePan", note: "hold" },
    {
      action: "Move the canvas",
      combo: { key: "Arrows" },
      effect: "arrowPan",
      note: "Shift for bigger steps; click the canvas first",
    },
  ],
  contactPrompt: "Something not working, or missing?",
  contactLink: "Tell me on the Feedback & contact page",
};
