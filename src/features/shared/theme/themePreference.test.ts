import { describe, expect, test } from "vitest";

import {
  THEME_STORAGE_KEY,
  parseThemePreference,
  resolveTheme,
  themeInitScript,
} from "./themePreference";

describe("parseThemePreference", () => {
  test("keeps an explicit light or dark choice", () => {
    expect(parseThemePreference("light")).toBe("light");
    expect(parseThemePreference("dark")).toBe("dark");
  });

  test("falls back to following the system for anything else", () => {
    expect(parseThemePreference(null)).toBe("system");
    expect(parseThemePreference("")).toBe("system");
    expect(parseThemePreference("system")).toBe("system");
    expect(parseThemePreference("DARK")).toBe("system");
  });
});

describe("resolveTheme", () => {
  test("an explicit choice wins over the system setting", () => {
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });

  test("system follows prefers-color-scheme", () => {
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
  });
});

describe("themeInitScript", () => {
  function run(stored: string | null, systemDark: boolean, storageThrows = false) {
    const root = { dataset: {} as Record<string, string>, style: {} as Record<string, string> };
    const env = {
      document: { documentElement: root },
      localStorage: {
        getItem: (key: string) => {
          if (storageThrows) throw new Error("blocked");
          return key === THEME_STORAGE_KEY ? stored : null;
        },
      },
      matchMedia: (query: string) => ({
        matches: query === "(prefers-color-scheme: dark)" && systemDark,
      }),
    };
    new Function("document", "localStorage", "matchMedia", themeInitScript)(
      env.document,
      env.localStorage,
      env.matchMedia,
    );
    return root;
  }

  test("applies the stored choice before paint", () => {
    expect(run("dark", false).dataset.theme).toBe("dark");
    expect(run("light", true).dataset.theme).toBe("light");
  });

  test("follows the system when nothing is stored", () => {
    const root = run(null, true);
    expect(root.dataset.theme).toBe("dark");
    expect(root.style.colorScheme).toBe("dark");
  });

  test("still follows the system when storage is unavailable", () => {
    expect(run(null, true, true).dataset.theme).toBe("dark");
    expect(run(null, false, true).dataset.theme).toBe("light");
  });
});
