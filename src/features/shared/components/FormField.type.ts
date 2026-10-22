import type { ReactNode } from "react";

export interface IFormFieldProps {
  label: string;
  htmlFor: string;
  hint?: ReactNode;
  /** Inline validation message shown under the control; pass `errorId` to the control's `aria-describedby`. */
  error?: string;
  errorId?: string;
  children: ReactNode;
  className?: string;
}
