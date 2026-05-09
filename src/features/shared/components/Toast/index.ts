/**
 * Purpose:
 * Barrel exports for the shared toast UI (provider + hook types).
 */

export { ToastProvider } from "@/features/shared/components/Toast/ToastProvider";
export type {
  ShowToastInput,
  ToastContextValue,
  ToastRecord,
  ToastTone,
} from "@/features/shared/components/Toast/ToastProvider";
export { useToast } from "@/features/shared/components/Toast/hooks/useToast";
