/**
 * Purpose:
 * ColorField behavior: keeps the hex text in sync with the value both ways. The picker and a full
 * six-digit hex (typed or pasted) apply at once; blur or Enter applies shorthand and tidies the
 * text, or shows an inline error (Enter then doesn't submit the form).
 */
"use client";

import { useId, useState, type ChangeEvent, type KeyboardEvent } from "react";

import { shared } from "@/content/shared";
import { parseHexColor } from "@/features/shared/utils/colorConverter";
import type { TUseColorFieldInput } from "./ColorField.type";

/** A complete six-digit hex, `#` optional: applied while typing; shorter forms wait for blur or Enter. */
const FULL_HEX = /^#?[0-9a-f]{6}$/i;

export function useColorField({ label, value, onValueChange }: TUseColorFieldInput) {
  const hexId = useId();
  const errorId = useId();
  const [draft, setDraft] = useState(value);
  const [syncedValue, setSyncedValue] = useState(value);
  const [error, setError] = useState<string | undefined>(undefined);

  if (value !== syncedValue) {
    setSyncedValue(value);
    setDraft(value);
    setError(undefined);
  }

  const apply = (hex: string) => {
    setSyncedValue(hex);
    if (hex !== value) {
      onValueChange(hex);
    }
  };

  /** Applies the draft or shows the error; returns whether it was valid. */
  const commitDraft = () => {
    const hex = parseHexColor(draft);
    if (!hex) {
      setError(shared.colorField.invalid);
      return false;
    }
    setDraft(hex);
    apply(hex);
    return true;
  };

  return {
    hexId,
    errorId,
    draft,
    error,
    pickerLabel: shared.colorField.pickerLabel(label),
    ariaInvalid: error ? true : undefined,
    describedBy: error ? errorId : undefined,
    changePicker: (event: ChangeEvent<HTMLInputElement>) => {
      const hex = parseHexColor(event.target.value);
      if (hex) {
        setDraft(hex);
        setError(undefined);
        apply(hex);
      }
    },
    changeHex: (event: ChangeEvent<HTMLInputElement>) => {
      const text = event.target.value;
      setDraft(text);
      setError(undefined);
      const hex = FULL_HEX.test(text.trim()) ? parseHexColor(text) : null;
      if (hex) {
        apply(hex);
      }
    },
    blurHex: () => {
      commitDraft();
    },
    keyDownHex: (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== "Enter") {
        return;
      }
      const pending = parseHexColor(draft) !== value;
      if (!commitDraft() || pending) {
        event.preventDefault();
      }
    },
  };
}
