import type { ReactNode } from "react";

export interface IFormFieldProps {
  label: string;
  htmlFor?: string;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
}
