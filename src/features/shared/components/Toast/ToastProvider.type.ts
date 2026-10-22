import type { ReactNode, RefObject } from "react";
import type { toast } from "./ToastProvider.style";

export type TToastTone = keyof typeof toast.tone;

/** A button in the toast, e.g. Undo; clicking it also dismisses the toast. */
export interface IToastAction {
  label: string;
  onAction: () => void;
}

export interface IToastRecord {
  id: string;
  message: string;
  tone: TToastTone;
  action?: IToastAction;
}

export interface IShowToastInput {
  message: string;
  tone?: TToastTone;
  /** Defaults to 4.5 s, or 8 s for errors and toasts with an action. */
  durationMs?: number;
  /** When true, skips enqueue if an identical message and tone is already visible. */
  skipDuplicateActiveToast?: boolean;
  action?: IToastAction;
}

export type TNormalizedToastInput = Required<Omit<IShowToastInput, "action">> &
  Pick<IShowToastInput, "action">;

/** Why the stack's auto-dismiss timers are on hold. */
export type TToastHold = "hover" | "focus";

/** Auto-dismiss state of one toast; `timeoutId` is null while paused. */
export interface IToastTimer {
  timeoutId: number | null;
  remainingMs: number;
  startedAt: number;
}

/** A toast as the stack renders it: the record, its DOM ids and its handlers. */
export interface IToastItem {
  id: string;
  elementId: string;
  /** Id of the message, which names the toast group (and is the alert for errors). */
  messageId: string;
  message: string;
  tone: TToastTone;
  actionLabel?: string;
  onAction: () => void;
  onDismiss: () => void;
}

export interface IToastContextValue {
  showToast: (input: IShowToastInput | string) => void;
  dismissToast: (id: string) => void;
}

export interface IToastItemProps {
  toast: IToastItem;
}

export interface IToastStackProps {
  alerts: IToastItem[];
  statuses: IToastItem[];
  regionRef: RefObject<HTMLDivElement | null>;
}

export interface IToastProviderProps {
  children: ReactNode;
}
