import type { ReactNode } from "react";

export interface ISwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  /** Secondary line under the label; stays readable when the switch is disabled. */
  hint?: string;
  /** Leading decorative icon. */
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
}
