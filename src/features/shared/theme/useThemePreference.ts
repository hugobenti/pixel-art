/**
 * Purpose:
 * Theme preference as an external store (localStorage + prefers-color-scheme): read it, change it,
 * and keep `data-theme` on <html> in step after first paint.
 *
 * Notes:
 * The inline script from themePreference.ts sets the first `data-theme` before React runs, so
 * useThemeSync only reacts to later changes (a pick here, another tab, or the OS switching). It never
 * writes on mount: during hydration React reads the server snapshot, which would flash light.
 */
"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

import type { TResolvedTheme, TThemePreference } from "./theme.type";
import {
  DARK_SCHEME_QUERY,
  THEME_STORAGE_KEY,
  parseThemePreference,
  resolveTheme,
} from "./themePreference";

/** Fired on window after this tab changes the preference (`storage` only fires in other tabs). */
const THEME_CHANGE_EVENT = "pixelcraft-themechange";

/** The pick for this page view when localStorage is blocked (private mode, policy). */
let unsavedPreference: TThemePreference = "system";

function subscribe(onChange: () => void): () => void {
  const media = window.matchMedia(DARK_SCHEME_QUERY);
  media.addEventListener("change", onChange);
  window.addEventListener("storage", onChange);
  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  return () => {
    media.removeEventListener("change", onChange);
    window.removeEventListener("storage", onChange);
    window.removeEventListener(THEME_CHANGE_EVENT, onChange);
  };
}

function readPreference(): TThemePreference {
  try {
    return parseThemePreference(window.localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return unsavedPreference;
  }
}

function readSystemDark(): boolean {
  return window.matchMedia(DARK_SCHEME_QUERY).matches;
}

/** The user's pick ("system" until they choose) and a setter that persists it. */
export function useThemePreference() {
  const preference = useSyncExternalStore(subscribe, readPreference, () => "system" as const);

  const setPreference = useCallback((next: TThemePreference) => {
    unsavedPreference = next;
    try {
      if (next === "system") {
        window.localStorage.removeItem(THEME_STORAGE_KEY);
      } else {
        window.localStorage.setItem(THEME_STORAGE_KEY, next);
      }
    } catch {
      // Storage blocked: readPreference falls back to unsavedPreference for this page view.
    }
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }, []);

  return { preference, setPreference };
}

/** The theme on screen; re-renders when it changes (canvas renderers re-read token colors). */
export function useResolvedTheme(): TResolvedTheme {
  const preference = useSyncExternalStore(subscribe, readPreference, () => "system" as const);
  const systemDark = useSyncExternalStore(subscribe, readSystemDark, () => false);
  return resolveTheme(preference, systemDark);
}

/** Mount once (AppProviders): applies every later preference or OS change to <html>. */
export function useThemeSync(): void {
  useEffect(
    () =>
      subscribe(() => {
        const theme = resolveTheme(readPreference(), readSystemDark());
        const root = document.documentElement;
        root.dataset.theme = theme;
        root.style.colorScheme = theme;
      }),
    [],
  );
}
