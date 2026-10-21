import type { ButtonHTMLAttributes } from "react";

export type TButtonVariant = "primary" | "ghost" | "danger" | "outline";

export type TButtonSize = "default" | "icon" | "step";

export type TButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: TButtonVariant;
  size?: TButtonSize;
};
