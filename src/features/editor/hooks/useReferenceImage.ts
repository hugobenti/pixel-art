/**
 * Purpose:
 * Encapsulate reference-image overlay state, loading, resizing, and hydration for the editor workspace.
 */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const ACCEPTED_IMAGE_TYPES = "image/png,image/jpeg,image/webp,image/gif,image/bmp";
const MAX_REFERENCE_SIDE = 512;
const REFERENCE_ALPHA = 0.5;

async function readFileAsDataUrl(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the selected image."));
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.readAsDataURL(file);
  });
}

async function loadImageElement(dataUrl: string): Promise<HTMLImageElement> {
  return await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not decode reference image."));
    img.src = dataUrl;
  });
}

async function compressReferenceImageDataUrl(rawDataUrl: string): Promise<string> {
  const source = await loadImageElement(rawDataUrl);
  const largestSide = Math.max(source.naturalWidth, source.naturalHeight);
  const ratio = largestSide > MAX_REFERENCE_SIDE ? MAX_REFERENCE_SIDE / largestSide : 1;

  const targetWidth = Math.max(1, Math.round(source.naturalWidth * ratio));
  const targetHeight = Math.max(1, Math.round(source.naturalHeight * ratio));

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not prepare reference image canvas.");
  }

  ctx.drawImage(source, 0, 0, targetWidth, targetHeight);
  return canvas.toDataURL("image/webp", 0.82);
}

interface UseReferenceImageParams {
  initialReferenceImageDataUrl?: string;
  onReferenceImageChange: (dataUrl?: string) => void;
}

interface UseReferenceImageResult {
  showReferenceImage: boolean;
  hasReferenceImage: boolean;
  referenceImageElement: HTMLImageElement | null;
  referenceAlpha: number;
  onToggleReferenceImage: () => void;
  onLoadReferenceImage: () => void;
}

export function useReferenceImage({
  initialReferenceImageDataUrl,
  onReferenceImageChange,
}: UseReferenceImageParams): UseReferenceImageResult {
  const [showReferenceImage, setShowReferenceImage] = useState(
    Boolean(initialReferenceImageDataUrl)
  );
  const [referenceImageDataUrl, setReferenceImageDataUrl] = useState(
    initialReferenceImageDataUrl
  );
  const [referenceImageElement, setReferenceImageElement] =
    useState<HTMLImageElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    const nextDataUrl = referenceImageDataUrl;
    if (!nextDataUrl) {
      return;
    }
    void loadImageElement(nextDataUrl)
      .then((img) => {
        if (!cancelled) {
          setReferenceImageElement(img);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setReferenceImageElement(null);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [referenceImageDataUrl]);

  const onToggleReferenceImage = useCallback(() => {
    setShowReferenceImage((prev) => (referenceImageDataUrl ? !prev : prev));
  }, [referenceImageDataUrl]);

  const onLoadReferenceImage = useCallback(() => {
    const picker = document.createElement("input");
    picker.type = "file";
    picker.accept = ACCEPTED_IMAGE_TYPES;
    picker.onchange = () => {
      const file = picker.files?.[0];
      if (!file) {
        return;
      }
      void (async () => {
        try {
          const rawDataUrl = await readFileAsDataUrl(file);
          const compressedDataUrl = await compressReferenceImageDataUrl(rawDataUrl);
          setReferenceImageDataUrl(compressedDataUrl);
          setShowReferenceImage(true);
          onReferenceImageChange(compressedDataUrl);
        } catch {
          // Ignore invalid image loads and keep the current reference image.
        }
      })();
    };
    picker.click();
  }, [onReferenceImageChange]);

  const hasReferenceImage = useMemo(
    () => Boolean(referenceImageDataUrl && referenceImageElement),
    [referenceImageDataUrl, referenceImageElement]
  );

  return {
    showReferenceImage,
    hasReferenceImage,
    referenceImageElement,
    referenceAlpha: REFERENCE_ALPHA,
    onToggleReferenceImage,
    onLoadReferenceImage,
  };
}
