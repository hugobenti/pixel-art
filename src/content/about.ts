import type { IAboutContent } from "./content.type";
import { site } from "./site";

export const about: IAboutContent = {
  metaTitle: "About",
  metaDescription: "Who makes PixelHB and why.",
  h1: "About PixelHB",
  intro:
    "PixelHB is a pixel-art editor that runs in your browser. It’s made for drawing sprites, icons and tiles without accounts, downloads or waiting.",
  sections: [
    {
      id: "privacy",
      title: "Your work stays with you",
      paragraphs: [
        "Everything happens on your device. Your artworks are saved in this browser, and nothing is sent to a server.",
      ],
    },
    {
      id: "why",
      title: "Why PixelHB exists",
      paragraphs: [
        "I was working on an art project and needed a complete pixel tool: layers I could organize, a reference image to draw from, a palette I fully control, and nothing to install. Every editor I tried was missing something, so I built my own.",
        "Now PixelHB is for anyone who loves pixels: artists, designers, game makers, and everyone who simply enjoys drawing.",
        "It’s made by an artist, for artists, and it grows with your feedback. Tell me what’s missing, and let’s build the best pixel tool together.",
      ],
    },
    {
      id: "source",
      title: "Source code",
      paragraphs: ["PixelHB’s code is on GitHub."],
    },
  ],
  feedbackLink: "Send feedback",
  githubLink: "View on GitHub",
  signature: site.author,
};
