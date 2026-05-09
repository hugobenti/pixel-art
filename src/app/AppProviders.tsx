/**
 * Purpose:
 * Client-side app shell providers (toast stack, future global context).
 */
"use client";

import type { ReactNode } from "react";

import { ToastProvider } from "@/features/shared/components/Toast";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return <ToastProvider>{children}</ToastProvider>;
}
