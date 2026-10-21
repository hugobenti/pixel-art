import type { HTMLAttributes, ReactNode } from "react";
import type { TModalLayer, TModalPlacement, TModalSize } from "@/features/shared/components/modal.styles.type";

export interface IModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  placement?: TModalPlacement;
  size?: TModalSize;
  layer?: TModalLayer;
  backdropBlur?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  overlayClassName?: string;
  panelClassName?: string;
  overlayProps?: Omit<HTMLAttributes<HTMLDivElement>, "children">;
  panelProps?: Omit<HTMLAttributes<HTMLDivElement>, "children">;
}
