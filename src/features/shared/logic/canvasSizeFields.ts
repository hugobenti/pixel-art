/**
 * Purpose:
 * Parses whole-number field text within a range, and the canvas width/height pair (1 to `max`) with
 * one error per field.
 */

import type { ICanvasSizeFieldErrors, ICanvasSizeFieldsResult } from "./canvasSizeFields.type";

const WHOLE_NUMBER = /^\d+$/;

/** The value of `text` as a whole number from `min` to `max`, or null when it is not one. */
export function parseWholeNumber(text: string, min: number, max: number): number | null {
  const trimmed = text.trim();
  if (!WHOLE_NUMBER.test(trimmed)) {
    return null;
  }
  const value = Number.parseInt(trimmed, 10);
  return value >= min && value <= max ? value : null;
}

export function parseCanvasSizeFields(
  widthText: string,
  heightText: string,
  max: number,
  rangeMessage: string,
): ICanvasSizeFieldsResult {
  const width = parseWholeNumber(widthText, 1, max);
  const height = parseWholeNumber(heightText, 1, max);
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
