import type { ComponentProps, ReactNode } from "react";

export type TNumberFieldProps = Omit<
  ComponentProps<"input">,
  "id" | "type" | "inputMode" | "min" | "max" | "children" | "className"
> & {
  label: string;
  /** Smallest accepted whole number. */
  min: number;
  /** Largest accepted whole number; also caps the digits that can be typed. */
  max: number;
  /** Error from the form's submit validation; wins over the field's own blur check. */
  error?: string;
  hint?: ReactNode;
  /** Layout classes for the field stack (label, control, messages). */
  className?: string;
};

export interface IUseNumberFieldInput {
  value: ComponentProps<"input">["value"];
  min: number;
  max: number;
  error?: string;
  onBlur?: ComponentProps<"input">["onBlur"];
}
