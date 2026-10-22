/**
 * Purpose:
 * NumberField behavior: ids for the label and error, the digit cap from `max`, and a range check on
 * blur that fills the error slot while the value stays the one it checked (typed or set by the
 * form, e.g. a preset); a submit error from the form wins.
 */
"use client";

import { useId, useState, type FocusEvent } from "react";

import { shared } from "@/content/shared";
import { parseWholeNumber } from "@/features/shared/logic/canvasSizeFields";
import type { IUseNumberFieldInput } from "./NumberField.type";

export function useNumberField({ value, min, max, error, onBlur }: IUseNumberFieldInput) {
  const id = useId();
  const errorId = useId();
  const [blurCheck, setBlurCheck] = useState<{ text: string; error?: string } | null>(null);
  const blurError = blurCheck?.text === String(value ?? "") ? blurCheck.error : undefined;
  const shownError = error ?? blurError;

  return {
    id,
    errorId,
    shownError,
    maxLength: String(max).length,
    ariaInvalid: shownError ? true : undefined,
    describedBy: shownError ? errorId : undefined,
    handleBlur: (event: FocusEvent<HTMLInputElement>) => {
      const text = event.target.value;
      const valid = parseWholeNumber(text, min, max) !== null;
      setBlurCheck({ text, error: valid ? undefined : shared.numberField.range(min, max) });
      onBlur?.(event);
    },
  };
}
