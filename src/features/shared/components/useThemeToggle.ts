/**
 * Purpose:
 * ThemeToggle view model: a Light and a Dark radio; the one matching the theme on screen is checked
 * (on a first visit that is the OS theme, until the user picks).
 */
"use client";

import { useId, type ChangeEvent } from "react";

import { shared } from "@/content/shared";
import { THEME_OPTIONS } from "@/features/shared/theme/themePreference";
import { useResolvedTheme, useSetTheme } from "@/features/shared/theme/useThemePreference";

export function useThemeToggle() {
  const theme = useResolvedTheme();
  const setTheme = useSetTheme();
  const labelId = useId();
  const name = useId();

  return {
    labelId,
    name,
    label: shared.theme.label,
    options: THEME_OPTIONS.map((value) => ({
      value,
      label: shared.theme.options[value],
      checked: value === theme,
    })),
    onChange: (event: ChangeEvent<HTMLInputElement>) =>
      setTheme(event.target.value === "dark" ? "dark" : "light"),
  };
}
