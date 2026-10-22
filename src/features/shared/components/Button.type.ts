import type { ButtonHTMLAttributes } from "react";
import type { button } from "./Button.style";

export type TButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof button.variant;
  size?: keyof typeof button.size;
};
