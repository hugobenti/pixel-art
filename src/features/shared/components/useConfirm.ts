/**
 * Purpose:
 * Promise-based confirmation: `await confirm(options)` opens a ConfirmDialog and resolves true on
 * confirm, false on Cancel / Escape / backdrop. Render the returned `dialog` with `<ConfirmDialog {...dialog} />`.
 *
 * Notes:
 * A new request while one is open cancels the previous one; unmounting cancels the open one.
 */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { IConfirmDialogProps, IConfirmOptions } from "./ConfirmDialog.type";

export function useConfirm() {
  const [options, setOptions] = useState<IConfirmOptions | null>(null);
  const resolveRef = useRef<((confirmed: boolean) => void) | null>(null);

  const settle = useCallback((confirmed: boolean) => {
    const resolve = resolveRef.current;
    resolveRef.current = null;
    setOptions(null);
    resolve?.(confirmed);
  }, []);

  const confirm = useCallback((next: IConfirmOptions) => {
    resolveRef.current?.(false);
    setOptions(next);
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  useEffect(
    () => () => {
      resolveRef.current?.(false);
    },
    [],
  );

  const dialog = useMemo<IConfirmDialogProps>(
    () => ({ options, onConfirm: () => settle(true), onCancel: () => settle(false) }),
    [options, settle],
  );

  return { confirm, dialog };
}
