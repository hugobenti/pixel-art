import type { HTMLAttributes, ReactNode } from "react";

export interface ICardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}
