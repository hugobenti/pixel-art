import type { ReactNode } from "react";

export interface IColorFieldProps {
  label: string;
  /** Keeps the label for assistive tech only (when a legend already names the field). */
  hideLabel?: boolean;
  /** Current color as `#RRGGBB`. */
  value: string;
  /** Called with a valid `#RRGGBB` (upper case) from the picker or the hex input. */
  onValueChange: (hex: string) => void;
  /** Called whenever the current draft becomes valid or invalid. */
  onValidityChange?: (valid: boolean) => void;
  disabled?: boolean;
  hint?: ReactNode;
  /** Layout classes for the field stack. */
  className?: string;
}

export type TUseColorFieldInput = Pick<
  IColorFieldProps,
  "label" | "value" | "onValueChange" | "onValidityChange"
>;
