/**
 * Purpose:
 * Barrel exports for the shared toast UI (provider + hook types).
 */

export { ToastProvider } from "@/features/shared/components/Toast/ToastProvider";
export type {
  IShowToastInput,
  IToastAction,
  IToastContextValue,
  IToastRecord,
  TToastTone,
} from "@/features/shared/components/Toast/ToastProvider.type";
export { useToast } from "@/features/shared/components/Toast/hooks/useToast";
