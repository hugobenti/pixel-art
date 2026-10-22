import type { FormEvent, HTMLAttributes, ReactNode } from "react";
import type { modal } from "./Modal.style";

export interface IModalProps {
  open: boolean;
  onClose: () => void;
  /** Rendered as the dialog heading; the panel is labelled by it. */
  title: ReactNode;
  children: ReactNode;
  /** Right-aligned actions under the content (inside the form when `onSubmit` is set). */
  footer?: ReactNode;
  /** Makes the content and footer one `<form>`, so Enter in a field submits and footer buttons can be `type="submit"`. */
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  size?: keyof typeof modal.size;
  layer?: keyof typeof modal.layer;
  /** Backdrop treatment: blurred scrim (default), plain scrim, or none. */
  dim?: keyof typeof modal.dim;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  /** Extra attributes for the dialog panel (e.g. `role="alertdialog"`, `aria-describedby`). */
  panelProps?: Omit<HTMLAttributes<HTMLDivElement>, "children" | "className">;
}

export interface IUseModalInput extends Pick<IModalProps, "open" | "onClose"> {
  closeOnEscape: boolean;
}
