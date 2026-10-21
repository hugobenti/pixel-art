/**
 * Purpose:
 * Client-side app shell providers (toast stack, future global context).
 */
"use client";
import { ToastProvider } from "@/features/shared/components/Toast";
import type { IAppProvidersProps } from "./AppProviders.type";

export function AppProviders({ children }: IAppProvidersProps) {
  return <ToastProvider>{children}</ToastProvider>;
}
