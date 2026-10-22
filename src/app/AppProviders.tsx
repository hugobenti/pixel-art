/**
 * Purpose:
 * Client-side app shell providers: toast stack, and keeping the light/dark theme in step with the
 * user's pick and the OS setting.
 */
"use client";
import { ToastProvider } from "@/features/shared/components/Toast";
import { useThemeSync } from "@/features/shared/theme/useThemePreference";
import type { IAppProvidersProps } from "./AppProviders.type";

export function AppProviders({ children }: IAppProvidersProps) {
  useThemeSync();
  return <ToastProvider>{children}</ToastProvider>;
}
