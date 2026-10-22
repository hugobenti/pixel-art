/**
 * Purpose:
 * Form state and submit flow for the “new artwork” dialog (title, size, background color).
 */
"use client";

import { useCallback, useState, type FormEvent } from "react";

import { gallery } from "@/content/gallery";
import { shared } from "@/content/shared";
import {
  DEFAULT_PALETTE,
  MAX_CANVAS_DIMENSION,
} from "@/features/shared/artwork/artworkService";
import type { TUseCreateArtworkFormOptions } from "./useCreateArtworkForm.type";

export function useCreateArtworkForm({ onCreate }: TUseCreateArtworkFormOptions) {
  const [title, setTitle] = useState(shared.artwork.untitled);
  const [width, setWidth] = useState("64");
  const [height, setHeight] = useState("64");
  const [backgroundColor, setBackgroundColor] = useState(
    DEFAULT_PALETTE[1] ?? "#FFFFFF"
  );
  const [busy, setBusy] = useState(false);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const w = Number.parseInt(width, 10);
      const h = Number.parseInt(height, 10);
      if (!Number.isFinite(w) || !Number.isFinite(h)) {
        return;
      }
      setBusy(true);
      try {
        await onCreate({
          title,
          width: w,
          height: h,
          backgroundColor,
        });
      } finally {
        setBusy(false);
      }
    },
    [title, width, height, backgroundColor, onCreate]
  );

  return {
    title,
    setTitle,
    width,
    setWidth,
    height,
    setHeight,
    backgroundColor,
    setBackgroundColor,
    busy,
    maxSizeHint: gallery.create.maxSize(MAX_CANVAS_DIMENSION),
    handleSubmit,
  };
}
