/**
 * Purpose:
 * Light/dark theme preference: parsing the stored choice, resolving it against the OS setting, and
 * the inline script that sets `data-theme` on <html> before first paint (no flash of the wrong theme).
 *
 * Notes:
 * Dark tokens live under `[data-theme="dark"]` in src/app/globals.css. The stored value is
 * "light" | "dark"; no stored value means "follow the system".
 */
import type { TResolvedTheme, TThemePreference } from "./theme.type";

export const THEME_STORAGE_KEY = "pixelcraft-theme";

export const DARK_SCHEME_QUERY = "(prefers-color-scheme: dark)";

/** Order the theme control lists its options in. */
export const THEME_PREFERENCES: readonly TThemePreference[] = ["system", "light", "dark"];

export function parseThemePreference(raw: string | null): TThemePreference {
  return raw === "light" || raw === "dark" ? raw : "system";
}

export function resolveTheme(preference: TThemePreference, systemDark: boolean): TResolvedTheme {
  if (preference === "system") {
    return systemDark ? "dark" : "light";
  }
  return preference;
}

/**
 * Runs in <head> before React. Self-contained (it can't import the helpers above), so it mirrors
 * parseThemePreference + resolveTheme; themePreference.test.ts keeps the two in step.
 */
export const themeInitScript = `(function () {
  var stored = null;
  try { stored = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)}); } catch (e) {}
  var theme = stored === "light" || stored === "dark" ? stored
    : matchMedia(${JSON.stringify(DARK_SCHEME_QUERY)}).matches ? "dark" : "light";
  var root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
})();`;
