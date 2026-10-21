import type { HTMLAttributes, ReactNode } from "react";

export interface IButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  "aria-label"?: string;
}
