/** The stored state: an explicit pick, or "system" while the user hasn't picked yet (first visit follows the OS). */
export type TThemePreference = "system" | "light" | "dark";

/** The theme actually on screen (`data-theme` on <html>). */
export type TResolvedTheme = "light" | "dark";
