/** What the user picked: follow the OS, or force a theme. */
export type TThemePreference = "system" | "light" | "dark";

/** The theme actually on screen (`data-theme` on <html>). */
export type TResolvedTheme = "light" | "dark";
