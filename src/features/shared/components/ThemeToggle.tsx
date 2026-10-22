/**
 * Purpose:
 * System / Light / Dark theme switch. Native radios, so arrow keys move between options.
 */
"use client";

import { cx } from "@/features/shared/utils/cx";
import { themeToggle } from "./ThemeToggle.style";
import type { IThemeToggleProps } from "./ThemeToggle.type";
import { useThemeToggle } from "./useThemeToggle";

export function ThemeToggle({ variant = "inline", className }: IThemeToggleProps) {
  const { labelId, name, label, options, onChange } = useThemeToggle();

  return (
    <div
      role="radiogroup"
      aria-labelledby={labelId}
      className={cx(themeToggle.base, themeToggle.variant[variant], className)}
    >
      <span id={labelId} className={themeToggle.label[variant]}>
        {label}
      </span>
      <div className={themeToggle.track}>
        {options.map((option) => (
          <label key={option.value}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={option.checked}
              onChange={onChange}
              className={themeToggle.input}
            />
            <span className={themeToggle.option}>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
