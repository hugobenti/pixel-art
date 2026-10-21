/**
 * Purpose:
 * React context carrying the toast API from ToastProvider to `useToast`.
 */
"use client";

import { createContext } from "react";

import type { ToastContextValue } from "@/features/shared/components/Toast/ToastProvider";

export const ToastContext = createContext<ToastContextValue | null>(null);
