/**
 * Purpose:
 * Classes for the EditorScreen route shell: centered message frame, error line, gallery link and loading text.
 */

import { focusRing } from "@/features/shared/components/focus.style";
import { cx } from "@/features/shared/utils/cx";

export const editorScreen = {
  frame: "mx-auto max-w-lg px-4 py-16 text-center",
  error: "text-danger-fg",
  backLink: cx("mt-4 inline-block text-fg-secondary underline", focusRing),
  loading: "text-muted",
};
