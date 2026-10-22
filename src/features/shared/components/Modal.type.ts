import type { HTMLAttributes, ReactNode } from "react";
import type { modal } from "./Modal.style";

export interface IModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  placement?: keyof typeof modal.placement;
  size?: keyof typeof modal.size;
  layer?: keyof typeof modal.layer;
  backdropBlur?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  overlayClassName?: string;
  panelClassName?: string;
  overlayProps?: Omit<HTMLAttributes<HTMLDivElement>, "children">;
  panelProps?: Omit<HTMLAttributes<HTMLDivElement>, "children">;
}

export interface IUseModalInput extends Pick<IModalProps, "open" | "onClose"> {
  closeOnEscape: boolean;
}
