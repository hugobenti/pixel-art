import type { themeToggle } from "./ThemeToggle.style";

export interface IThemeToggleProps {
  variant?: keyof typeof themeToggle.variant;
  className?: string;
}
