import type { IMenuNavigationItem, TMenuNavigationKey } from "./menuNavigation.type";

export function menuFocusIndex(
  currentIndex: number,
  key: TMenuNavigationKey,
  items: readonly IMenuNavigationItem[],
): number {
  if (key === "Home") {
    for (let index = 0; index < items.length; index += 1) {
      if (!items[index].disabled) {
        return index;
      }
    }
    return -1;
  }
  if (key === "End") {
    for (let index = items.length - 1; index >= 0; index -= 1) {
      if (!items[index].disabled) {
        return index;
      }
    }
    return -1;
  }

  const direction = key === "ArrowDown" ? 1 : -1;
  const currentIsEnabled =
    currentIndex >= 0 && currentIndex < items.length && !items[currentIndex].disabled;
  let index = currentIsEnabled ? currentIndex : direction > 0 ? -1 : 0;

  for (let offset = 0; offset < items.length; offset += 1) {
    index = (index + direction + items.length) % items.length;
    if (!items[index].disabled) {
      return index;
    }
  }
  return -1;
}
