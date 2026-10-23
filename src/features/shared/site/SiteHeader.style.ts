/**
 * Purpose:
 * Classes for SiteHeader: the row, the desktop links, the primary action and the phone menu rows.
 */

import { button } from "@/features/shared/components/Button.style";
import { focusRing } from "@/features/shared/components/focus.style";
import { cx } from "@/features/shared/utils/cx";

export const siteHeader = {
  bar: "border-b border-line bg-bg",
  row: "mx-auto flex w-full max-w-6xl items-center gap-2 px-4 py-3 sm:gap-4",
  logo: cx("flex shrink-0 rounded-sm", focusRing),
  nav: "ml-2 hidden items-center gap-1 sm:flex",
  link: cx(
    "inline-flex min-h-10 items-center rounded-sm border-b-2 px-2 text-sm font-medium transition-colors pointer-coarse:min-h-11",
    focusRing,
  ),
  linkState: {
    current: "border-line-strong text-fg",
    other: "border-transparent text-fg-soft hover:text-fg",
  },
  spacer: "flex-1",
  /** Wrapper: IconButton's own `inline-flex` would beat `hidden` on the button itself. */
  theme: "hidden sm:block",
  themePending: "invisible",
  /** Same classes as `<Button>` primary, on a `<Link>`. */
  primary: cx(button.base, button.size.default, button.variant.primary, "shrink-0"),
  primaryButton: "shrink-0",
  labelFull: "hidden sm:inline",
  labelCompact: "sm:hidden",
  menuButton: "sm:hidden",
  menuList: "flex flex-col",
  menuRow: cx(
    "flex min-h-12 items-center rounded-lg px-3 text-base font-medium hover:bg-surface-muted",
    focusRing,
  ),
  menuRowState: {
    current: "bg-surface-muted text-fg",
    other: "text-fg-soft",
  },
  menuTheme: "mt-2 border-t border-line pt-4",
};
