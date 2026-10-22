/**
 * Purpose:
 * React context carrying the toast API from ToastProvider to useToast.
 */
"use client";

import { createContext } from "react";

import type { IToastContextValue } from "./ToastProvider.type";

export const ToastContext = createContext<IToastContextValue | null>(null);
