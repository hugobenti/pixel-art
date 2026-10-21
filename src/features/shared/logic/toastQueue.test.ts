/**
 * Purpose:
 * Unit tests for toast input normalization and duplicate detection.
 */

import { describe, expect, it } from "vitest";

import {
  DEFAULT_TOAST_DURATION_MS,
  isDuplicateActiveToast,
  normalizeToastInput,
} from "@/features/shared/logic/toastQueue";

describe("normalizeToastInput", () => {
  it("treats a string as a neutral message with the default duration", () => {
    expect(normalizeToastInput("Saved")).toEqual({
      message: "Saved",
      tone: "neutral",
      durationMs: DEFAULT_TOAST_DURATION_MS,
      skipDuplicateActiveToast: false,
    });
  });

  it("keeps explicit tone, duration and duplicate flag", () => {
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
});

describe("isDuplicateActiveToast", () => {
  const active = [{ id: "a", message: "Saved", tone: "success" as const }];

  it("matches a visible toast with the same message and tone", () => {
    expect(isDuplicateActiveToast(active, "Saved", "success")).toBe(true);
  });

  it("does not match a different tone or message", () => {
    expect(isDuplicateActiveToast(active, "Saved", "neutral")).toBe(false);
    expect(isDuplicateActiveToast(active, "Other", "success")).toBe(false);
  });
});
