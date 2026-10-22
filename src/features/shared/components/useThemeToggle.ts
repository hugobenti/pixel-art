/**
 * Purpose:
 * ThemeToggle view model: one radio per preference with its label and checked state.
 */
"use client";

import { useId, type ChangeEvent } from "react";

import { shared } from "@/content/shared";
import { THEME_PREFERENCES, parseThemePreference } from "@/features/shared/theme/themePreference";
import { useThemePreference } from "@/features/shared/theme/useThemePreference";

export function useThemeToggle() {
  const { preference, setPreference } = useThemePreference();
  const labelId = useId();
  const name = useId();

  return {
    labelId,
    name,
    label: shared.theme.label,
    options: THEME_PREFERENCES.map((value) => ({
      value,
      label: shared.theme.options[value],
      checked: value === preference,
    })),
    onChange: (event: ChangeEvent<HTMLInputElement>) =>
      setPreference(parseThemePreference(event.target.value)),
  };
}
