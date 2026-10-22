"use client";

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

import { menuFocusIndex } from "@/features/shared/logic/menuNavigation";
import type { IMenuProps } from "./Menu.type";

export function useMenu({ items }: IMenuProps) {
  const [open, setOpen] = useState(false);
  const triggerId = useId();
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const focusIndexAfterOpen = useRef<number | null>(null);

  const openAt = useCallback(
    (key: "ArrowDown" | "ArrowUp") => {
      focusIndexAfterOpen.current = menuFocusIndex(-1, key, items);
      setOpen(true);
    },
    [items],
  );

  useEffect(() => {
    if (!open) return;
    const focusIndex = focusIndexAfterOpen.current;
    if (focusIndex !== null) {
      menuRef.current
        ?.querySelector<HTMLButtonElement>(`[data-menu-index="${focusIndex}"]`)
        ?.focus();
      focusIndexAfterOpen.current = null;
    }
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePointer);
  }, [open]);

  const toggle = useCallback(() => {
    if (open) {
      setOpen(false);
      return;
    }
    openAt("ArrowDown");
  }, [open, openAt]);

  const onTriggerKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        openAt(event.key);
      }
    },
    [openAt],
  );

  const onMenuKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        rootRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
        return;
      }
      if (event.key === "Tab") {
        setOpen(false);
        return;
      }
      const target = event.target;
      const item = target instanceof Element ? target.closest<HTMLElement>("[data-menu-index]") : null;
      const currentIndex = item ? Number(item.dataset.menuIndex) : -1;
      if (
        event.key !== "ArrowDown" &&
        event.key !== "ArrowUp" &&
        event.key !== "Home" &&
        event.key !== "End"
      ) {
        return;
      }
      const nextIndex = menuFocusIndex(currentIndex, event.key, items);
      if (nextIndex >= 0) {
        event.preventDefault();
        menuRef.current
          ?.querySelector<HTMLButtonElement>(`[data-menu-index="${nextIndex}"]`)
          ?.focus();
      }
    },
    [items],
  );

  const selectItem = useCallback(
    (index: number) => {
      const item = items[index];
      if (!item || item.disabled) return;
      item.onSelect();
      setOpen(false);
      rootRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    },
    [items],
  );

  return { open, triggerId, menuId, rootRef, menuRef, toggle, onTriggerKeyDown, onMenuKeyDown, selectItem };
}
