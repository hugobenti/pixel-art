/**
 * Purpose:
 * Parses the new-artwork width and height fields: whole numbers from 1 to `max`, one error per field.
 */

import type { ICanvasSizeFieldErrors, ICanvasSizeFieldsResult } from "./createArtworkFields.type";

const WHOLE_NUMBER = /^\d+$/;

function parseDimension(text: string, max: number): number | null {
  const trimmed = text.trim();
  if (!WHOLE_NUMBER.test(trimmed)) {
    return null;
  }
  const value = Number.parseInt(trimmed, 10);
  return value >= 1 && value <= max ? value : null;
}

export function parseCanvasSizeFields(
  widthText: string,
  heightText: string,
  max: number,
  rangeMessage: string,
): ICanvasSizeFieldsResult {
  const width = parseDimension(widthText, max);
  const height = parseDimension(heightText, max);
  const errors: ICanvasSizeFieldErrors = {};
  if (width === null) {
    errors.width = rangeMessage;
  }
  if (height === null) {
    errors.height = rangeMessage;
  }
  return {
    size: width !== null && height !== null ? { width, height } : null,
    errors,
  };
}
