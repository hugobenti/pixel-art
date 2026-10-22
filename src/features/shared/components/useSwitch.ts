/**
 * Purpose:
 * Switch behavior: label/hint ids for the accessible name and description, and the toggle handler.
 */
"use client";

import { useId } from "react";

import type { ISwitchProps } from "./Switch.type";

export function useSwitch({ checked, onCheckedChange }: ISwitchProps) {
  const labelId = useId();
  const hintId = useId();
  return {
    labelId,
    hintId,
    toggle: () => onCheckedChange(!checked),
  };
}
