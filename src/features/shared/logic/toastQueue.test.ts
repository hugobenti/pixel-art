import { describe, expect, it } from "vitest";

import {
  DEFAULT_TOAST_DURATION_MS,
  hasActiveDuplicate,
  normalizeToastInput,
  toastElementId,
  withoutToast,
} from "@/features/shared/logic/toastQueue";

describe("normalizeToastInput", () => {
  it("turns a plain message into a neutral toast with the default duration", () => {
    expect(normalizeToastInput("Saved")).toEqual({
      message: "Saved",
      tone: "neutral",
      durationMs: DEFAULT_TOAST_DURATION_MS,
      skipDuplicateActiveToast: false,
    });
  });

  it("keeps the tone, duration and duplicate flag it is given", () => {
    expect(
      normalizeToastInput({
        message: "Failed",
        tone: "error",
        durationMs: 1000,
        skipDuplicateActiveToast: true,
      }),
    ).toEqual({
      message: "Failed",
      tone: "error",
      durationMs: 1000,
      skipDuplicateActiveToast: true,
    });
  });

  it("defaults the duration to 4.5 seconds", () => {
    expect(DEFAULT_TOAST_DURATION_MS).toBe(4500);
  });
});

describe("hasActiveDuplicate", () => {
  const toasts = [{ id: "a", message: "Saved", tone: "success" as const }];

  it("finds a visible toast with the same message and tone", () => {
    expect(hasActiveDuplicate(toasts, "Saved", "success")).toBe(true);
  });

  it("ignores a toast with the same message but another tone", () => {
    expect(hasActiveDuplicate(toasts, "Saved", "error")).toBe(false);
  });
});

describe("withoutToast", () => {
  it("removes only the toast with the given id", () => {
    const toasts = [
      { id: "a", message: "One", tone: "neutral" as const },
      { id: "b", message: "Two", tone: "neutral" as const },
    ];
    expect(withoutToast(toasts, "a")).toEqual([toasts[1]]);
  });
});

describe("toastElementId", () => {
  it("prefixes the toast id", () => {
    expect(toastElementId("abc")).toBe("toast-abc");
  });
});
