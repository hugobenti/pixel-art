/**
 * Purpose:
 * Form state and submit flow for the “new artwork” dialog (title, size, background color).
 */
"use client";

import { useCallback, useState, type FormEvent } from "react";

import type { CreateArtworkInput } from "@/features/gallery/services/galleryService";

type UseCreateArtworkFormOptions = {
  onCreate: (input: CreateArtworkInput) => Promise<unknown>;
};

export function useCreateArtworkForm({ onCreate }: UseCreateArtworkFormOptions) {
  const [title, setTitle] = useState("Untitled");
  const [width, setWidth] = useState("64");
  const [height, setHeight] = useState("64");
  const [backgroundColor, setBackgroundColor] = useState("#000000");
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
    handleSubmit,
  };
}
