# PixelHB presentation: implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the presentation layer from the spec: a card menu that works on phones, a brand-matched light accent, a shared site header/footer, a redesigned gallery, and the Home, About, Feedback & contact, Help, 404 and error pages, with the copy fixed by the spec.

**Architecture:** Shell components live in `src/features/shared/site/` (the gallery and the site pages both use them, and features can't import each other). The new pages live in a new feature `src/features/site/`. Home, About, Help and Contact sit in an `app/(site)` route group whose layout renders the shell. The gallery renders the shell itself so it can pass its own primary action. The editor is untouched apart from the global color tokens.

**Tech Stack:** Next.js 16.2.5 App Router, React, Tailwind v4 (semantic tokens only), zustand, Dexie, Vitest 3 in the `node` environment (no DOM testing library: only pure `.ts` logic is unit-tested; UI is verified in the browser).

**Spec:** `docs/design/presentation.md` (same branch). Read it before any task; copy marked as fixed there is used verbatim.

## Global Constraints

- `AGENTS.md` rules apply to every file. `X.tsx` is presentation only; behavior and derived values go in `useX.ts`; pure logic goes in `features/*/logic/*.ts` with a test; classes go in `X.style.ts`; types go in `X.type.ts` (`I` prefix for interfaces, `T` for type aliases); static lists go in `X.data.ts`; all copy, including `aria-label`s, goes in `src/content`, typed in `src/content/content.type.ts`.
- Use token utilities only (`bg-surface`, `text-muted`, …). Raw colors fail lint.
- Branch per PR, about 20 files at most, and never commit to `main`. Branches are stacked: each starts from the previous one. Hugo reviews and merges each PR in order.
- Before asking for review: `npm run lint`, `npm run typecheck`, `npm test`, and a production build in isolation (`NEXT_DIST_DIR=.next-verify npm run build`). Never touch `.next`.
- UI verification for every PR: run `npm run dev -- -p 3400` in the worktree and take screenshots of the changed screens in both themes at 1440 × 900 and 390 × 844. Run `npm run design:detect -- http://localhost:3400/<route>`, plus a second run with `--viewport 390x844`. Put the screenshots in the PR description.
- Brand: the name is written **PixelHB**. Copy never says "pencil" and never explains the HB joke. The logo is scaled only by whole-number factors.
- Copy voice (spec "Voice"):
  - Sentence case and second person.
  - No "IndexedDB", "local storage" or "JSON" in visible site or gallery text.
  - Use `×` (U+00D7), curly quotes and `…`.
  - Sizes and counts are set in `font-mono`.
- 44px minimum targets on coarse pointers, visible focus, `prefers-reduced-motion` honored, and an accessible name on every control.
- Don't rename user-storage identifiers (`PixelCraftDB`, `pixelcraft-theme`, `pixelcraft-themechange`).
- Repo facts this plan relies on:
  - `Modal` already renders as a bottom sheet below `sm` and restores focus on close (through `useFocusTrap`).
  - `IArtwork` has `width`, `height` and `updatedAt` (epoch ms).
  - `useToast().showToast({ message, tone })` shows a toast.
  - `PUBLIC_ICONS` must match `public/icons/*.svg` one-to-one. The icon test requires `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"` and `stroke-width="1.5"`.

## Review Focus

1. **Last card near the bottom of the screen.** On a phone the menu opens as a sheet. On desktop, when there is no room below the `⋯`, it opens above. It is never cut off. (Task 1 tests `menuPlacement`; Task 2 smoke-checks the first and last card.)
2. **Very long artwork titles.** They truncate in the card and in the sheet heading, and the menu's accessible name still holds the full title. (Task 2 and Task 10 smoke-check with a 60-character title.)
3. **A 320px-wide phone and 200% zoom.** The header must not overflow: phones show the compact primary label ("Start", "New"). (Task 7 smoke-checks at 320 × 640.)
4. **Rename, clone and delete must not flash skeletons.** The store reloads after every change, so skeletons show only while `loading` is true and the list is still empty. (Task 10 adds `showSkeleton` and a smoke check.)
5. **The theme control before and after hydration.** The theme button and the sheet's Light/Dark toggle must not flash the wrong icon after load. A theme switch made in the sheet also updates the header button. (Task 7 smoke-checks with a reload in dark mode.)

## Differences from the spec's rollout (planner's calls)

- **Seven PRs instead of five.** The spec's PR 3 (shell + gallery) and PR 4 (pages) would each pass the ~20-file limit, so each is split in two: shell / gallery, and home + about + contact / help + errors. The order and content are otherwise unchanged. PR 0 lands the unmerged logo branch first.
- **Compact primary label on phones.** On phones the header's primary action reads "Start" on site pages and "New" on the gallery, so the header fits 320px. The hero's full "Start drawing" button sits right below it.
- **Gallery is not in the `(site)` route group.** It renders `SiteShell` itself so it can pass "New artwork" as the header's action. `not-found` and `error` also render the shell themselves, because the root not-found sits outside the group layout.

---

## PR 0 · Prerequisite: brand logo on main

### Task 0: Land `feat/brand-logo`

- [ ] **Step 1:** Rebase `feat/brand-logo` (`bad5eee`) onto `origin/main`, which already contains brand-icons #32, the brand spec #30 and the rename #31. Keep `BrandLogo`, `logoDrawing.ts`, `--color-brand-hb` and the README banner. Resolve conflicts in favor of `origin/main` for the renamed comments.
- [ ] **Step 2:** Run lint, typecheck, test and the isolated build. Expected: all green.
- [ ] **Step 3:** Push, then open the PR "feat: PixelHB logo in the gallery header". Wait for Hugo to merge it. Every later branch starts from `origin/main` after this merge.

---

## PR 1 · `fix/card-menu-phone`

### Task 1: Menu placement logic

**Files:**
- Create: `src/features/shared/logic/menuPlacement.ts`, `menuPlacement.type.ts`, `menuPlacement.test.ts`

**Interfaces:**
- Produces:
  - `export type TMenuPlacement = "below" | "above";`
  - `export interface IMenuPlacementInput { triggerTop: number; triggerBottom: number; menuHeight: number; viewportHeight: number; gap: number }`
  - `export function menuPlacement(input: IMenuPlacementInput): TMenuPlacement`

- [ ] **Step 1: Write the failing tests** in `menuPlacement.test.ts`:
  - `"opens below when it fits"`: `{triggerTop:100, triggerBottom:140, menuHeight:130, viewportHeight:844, gap:4}` gives `"below"`.
  - `"opens above when below would pass the viewport"`: `{triggerTop:747, triggerBottom:787, menuHeight:130, viewportHeight:844, gap:4}` gives `"above"`. These are the numbers measured on the last card.
  - `"fits exactly below at the edge"`: `{triggerTop:600, triggerBottom:706, menuHeight:130, viewportHeight:844, gap:4}` gives `"below"`, because 706 + 4 + 130 = 840 ≤ 844 − 4.
  - `"picks the roomier side when neither fits"`: `{triggerTop:300, triggerBottom:340, menuHeight:400, viewportHeight:600, gap:4}` gives `"above"` (300 of room above against 260 below).
- [ ] **Step 2:** Run `npx vitest run src/features/shared/logic/menuPlacement.test.ts`. Expected: FAIL, module not found.
- [ ] **Step 3: Implement** `menuPlacement`:
  - Return `"below"` when `triggerBottom + gap + menuHeight <= viewportHeight - gap`.
  - Otherwise return `"above"` when `triggerTop - gap - menuHeight >= gap`.
  - Otherwise return the side with more room.
- [ ] **Step 4:** Run the test again. Expected: PASS.
- [ ] **Step 5:** Commit: `feat(menu): placement logic that keeps the dropdown on screen`.

### Task 2: Menu as a phone sheet and a flipping dropdown, with `⋯` on the title row

**Files:**
- Create: `src/features/shared/hooks/useMediaQuery.ts`, `src/features/shared/components/Menu.data.ts`
- Modify:
  - `src/features/shared/components/Menu.tsx`, `Menu.type.ts`, `Menu.style.ts`, `useMenu.ts`
  - `src/content/content.type.ts` and `src/content/shared.ts` (new `shared.menu`)
  - `src/features/gallery/components/ArtworkCard.tsx`, `ArtworkCard.style.ts`, `useArtworkCard.ts`

**Interfaces:**
- Consumes: `menuPlacement` (Task 1); `Modal` (`open`, `onClose`, `title`, `size`).
- Produces:
  - `export function useMediaQuery(query: string): boolean`. It uses `useSyncExternalStore` with `matchMedia` change listeners, copying the pattern in `useThemePreference.ts:29-40`. The server snapshot is `false`.
  - `IMenuItem` gains `tone?: "danger"`.
  - `IMenuProps` gains `sheetTitle: string`, the heading of the phone sheet.
  - `export const MENU_SHEET_QUERY = "(max-width: 639px), (pointer: coarse)";` goes in `Menu.data.ts`.

- [ ] **Step 1:** Add the copy and types:
  - `shared.menu = { sheetCloseLabel: "Close menu" }`.
  - `ISharedContent.menu: { sheetCloseLabel: string }`.
  - In `IMenuItem`, add `tone?: "danger"`.
- [ ] **Step 2:** Extend `useMenu`:
  - Add `const sheet = useMediaQuery(MENU_SHEET_QUERY)`.
  - In dropdown mode, measure the trigger and menu after opening (`useLayoutEffect` with `getBoundingClientRect`), then set `placement` from `menuPlacement({ …, viewportHeight: window.innerHeight, gap: 4 })`.
  - In sheet mode, skip the outside-pointer listener and the arrow-key focus. `Modal` owns focus and Escape.
  - Return `sheet`, `placement` and `close`, on top of the existing fields.
- [ ] **Step 3:** Update `Menu.style.ts`:
  - `items` loses its fixed `top-full left-0 mt-1` and gains `right-0`.
  - New `placement: { below: "top-full mt-1", above: "bottom-full mb-1" }`.
  - New `sheetList: "flex flex-col gap-1"`.
  - New `sheetItem`: full width, `min-h-12`, `rounded-lg`, `px-3`, `text-base`, `text-left`, `hover:bg-surface-subtle`, `focusRing`.
  - New `tone: { default: "text-fg", danger: "text-danger-fg" }`.
- [ ] **Step 4:** Update `Menu.tsx`. Keep the same trigger. When `sheet` is true, render `<Modal open={open} onClose={close} title={sheetTitle} size="sm">` holding the items as plain `<button>`s (not `role="menuitem"`). Otherwise render the existing `role="menu"` dropdown with `cx(menu.items, menu.placement[placement])`. Items get `cx(…, menu.tone[item.tone ?? "default"])`.
- [ ] **Step 5:** In the card, delete the separate `actions` row and render the title link and the `Menu` side by side in `titleRow` (`flex items-center gap-2`; title `min-w-0 flex-1 truncate`). Pass `sheetTitle={artwork.title}`, and set `tone: "danger"` on the Delete item in `useArtworkCard`.
- [ ] **Step 6:** Run `npm run lint && npm run typecheck && npm test`. Expected: all pass, and `menuNavigation` and `menuPlacement` stay green.
- [ ] **Step 7: Smoke test.** Use the dev server and the browser at 390 × 844 with touch emulation, after creating 3 artworks, one titled with 60 characters.
  - Tap `⋯` on the first and on the last card.
  - Expected: a bottom sheet titled with the artwork's name and three 48px rows, Delete in danger text.
  - It closes on a backdrop tap, on Escape and after Rename. Focus returns to `⋯`.
  - At 1440 × 900, with the window shortened to 700px, the last card's dropdown opens upward and stays on screen.
- [ ] **Step 8:** Commit, then open the PR `fix/card-menu-phone`. In the description, ask Hugo to check on his real phone: first and last card, page scrolled to the middle and to the bottom.

---

## PR 2 · `feat/brand-accent-light`

### Task 3: Light accent becomes burnt amber

**Files:**
- Modify:
  - `src/app/globals.css` lines 39-44 (light block only)
  - `DESIGN.md`: frontmatter `colors`, `### Primary` (189), `### Secondary` (193), token table rows (210-247)

- [ ] **Step 1:** Set the light tokens:
  - `--color-accent: #b4500f`
  - `--color-accent-hover: #94410c`
  - `--color-focus: #b4500f`
  - `--color-pick-primary: #b4500f`
  - `--color-pick-secondary: #2b3a9e`

  Leave `on-accent` at `#fcfbf7`, and the dark block unchanged. The section comment becomes "Primary action and selection: burnt amber (the logo's HB)".
- [ ] **Step 2:** Run `npx vitest run src/app/tokenContrast.test.ts`. Expected: PASS. The pairs that must hold are `on-accent/accent` (≈ 4.9), `on-accent/accent-hover`, `focus/bg` (≈ 4.2 ≥ 3), `pick-secondary/surface`, `accent/bg` and `accent/surface`. If a pair fails, darken `accent-hover`, or the one failing value only, and record the change in DESIGN.md.
- [ ] **Step 3:** Update DESIGN.md:
  - Primary becomes **Burnt Amber** (`#b4500f`, light) / **Studio Amber** (`#eda743`, dark).
  - Secondary becomes **Ultramarine** (`#2b3a9e`, light) / **Sky Blue** (`#7cb2ff`, dark).
  - Add a `brand-hb` row to the token table.
  - Update the matching frontmatter values.
- [ ] **Step 4: Smoke test.** Screenshot the gallery, the new-artwork dialog and the editor (palette rings) in light at 1440. Expected: amber primary button and focus ring; the primary swatch ring is amber, the secondary blue.
- [ ] **Step 5:** Commit `feat(theme): light accent matches the brand amber`, then open the PR.

---

## PR 3 · `feat/site-shell`

### Task 4: Pencil and banner logo variants

**Files:**
- Modify:
  - `src/features/shared/brand/brandArt.ts` (add `PENCIL_LOCKUP`)
  - `logoDrawing.ts`, `BrandLogo.tsx`, `BrandLogo.type.ts`, `BrandLogo.style.ts`
- Create: `src/features/shared/brand/logoDrawing.test.ts`

**Interfaces:**
- Produces:
  - `PENCIL_LOCKUP: readonly IBrandLockupPart[] = [{ grid: PENCIL_GRID, x: 0, y: 0 }]`
  - `export function logoDrawing(parts: readonly IBrandLockupPart[]): IBrandLogoDrawing`
  - `HORIZONTAL_LOGO`, `BANNER_LOGO` and `PENCIL_LOGO`
  - `BrandLogo` props: `{ variant?: keyof typeof brandLogo.variant; decorative?: boolean; className?: string }`. The default `variant` is `"horizontal"`. When `decorative` is true, the svg gets `aria-hidden` and no `role` or `aria-label`.

- [ ] **Step 1: Write the failing test** `logoDrawing.test.ts`: the three `viewBox` values are `"0 0 74 7"`, `"0 0 50 7"` and `"0 0 33 7"`. `PENCIL_LOGO` and `BANNER_LOGO` contain no `i` or `h` colors, so every `fill` is either a fixed brand hex or `var(--color-fg)`.
- [ ] **Step 2:** Run it. Expected: FAIL (`BANNER_LOGO` is undefined).
- [ ] **Step 3: Implement.** Factor the existing run→rect mapping into `logoDrawing(parts)` and export the three drawings. Then update `brandLogo` in `BrandLogo.style.ts`:

  ```
  variant: {
    horizontal: "w-[148px] sm:w-[222px]",
    banner: "w-[300px] md:w-[400px]",
    pencil: "w-[66px]",
  }
  ```

  (6× and 8× for the banner, 2× for the pencil.)
- [ ] **Step 4:** Run the test. Expected: PASS. The `brandSvg.test.ts` snapshots are unchanged.
- [ ] **Step 5:** Commit `feat(brand): pencil and banner logo variants`.

### Task 5: New icons

**Files:**
- Create in `public/icons/`: `sun.svg`, `moon.svg`, `menu.svg`, `mail.svg`, `lock.svg`, `chat.svg`
- Modify: `src/features/shared/constants/publicIcons.ts`

- [ ] **Step 1:** Add the six SVGs from the Heroicons v2 outline set: `sun`, `moon`, `bars-3` → `menu`, `envelope` → `mail`, `lock-closed` → `lock`, `chat-bubble-left-right` → `chat`. That is the family the existing icons use. Keep only `viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"` on the root and the path data, with no `style` attribute.
- [ ] **Step 2:** Register them as `sun`, `moon`, `menu`, `mail`, `lock`, `chat` in `PUBLIC_ICONS`.
- [ ] **Step 3:** Run `npx vitest run src/features/shared/constants/publicIcons.test.ts`. Expected: PASS.
- [ ] **Step 4:** Commit `feat(icons): sun, moon, menu, mail, lock, chat`.

### Task 6: Shell copy and site facts

**Files:**
- Modify: `src/content/site.ts`, `src/content/content.type.ts`, `src/content/metadata.ts`
- Create: `src/content/shell.ts`

**Interfaces:**
- Produces:
  - `ISiteContent` gains `metaDescription`, `author`, `email`, `repoUrl` and `issuesUrl`, all strings.
  - `IShellContent`:
    - `skipToContent`
    - `nav: { gallery, help, about, contact, github, label }`
    - `menu: { open, title }`
    - `theme: { toDark, toLight }`
    - `primary: { start, startCompact }`
    - `footer: { tagline, credit, copyright, linksLabel }`
- Values (verbatim):
  - `site.description` stays "Pixel-art editor for the browser". It is the tagline used by the OG image and the manifest.
  - `site.metaDescription`: "Draw pixel art in your browser. No account, no install. Your work stays on your device."
  - `site.author`: "Hugo Bentivegna"
  - `site.email`: "hugobenti@gmail.com"
  - `site.repoUrl`: "https://github.com/hugobenti/pixelHB"
  - `site.issuesUrl`: "https://github.com/hugobenti/pixelHB/issues/new"
  - `shell.skipToContent`: "Skip to content"
  - `shell.nav`: Gallery · Help · About · Feedback & contact · GitHub, with `label` "Main"
  - `shell.menu`: `open` "Open menu", `title` "Menu"
  - `shell.theme`: `toDark` "Switch to dark theme", `toLight` "Switch to light theme"
  - `shell.primary`: `start` "Start drawing", `startCompact` "Start"
  - `shell.footer`:
    - `tagline` "Pixel-art editor for the browser."
    - `credit` "Made by Hugo Bentivegna"
    - `copyright` "© 2026"
    - `linksLabel` "Site"
- `siteMetadata` becomes `{ title: { default: site.name, template: "%s · " + site.name }, description: site.metaDescription }`. Write the template with a template literal inside `metadata.ts`; content files may use them.

- [ ] **Step 1:** Write the types, values and metadata.
- [ ] **Step 2:** Run `npm run typecheck`. Expected: PASS.
- [ ] **Step 3:** Commit `feat(content): site shell copy and contact facts`.

### Task 7: SiteShell, header, phone menu, footer; gallery uses it

**Files:**
- Create in `src/features/shared/site/`:
  - `SiteShell.tsx`, `SiteShell.style.ts`, `SiteShell.type.ts`
  - `SiteHeader.tsx`, `SiteHeader.style.ts`, `useSiteHeader.ts`
  - `SiteFooter.tsx`, `SiteFooter.style.ts`
  - `siteNav.data.ts`
  - `siteType.style.ts` (the shared type styles for site pages)
- Modify: `src/features/gallery/components/GalleryScreen.tsx`, `GalleryScreen.style.ts`, `useGalleryScreen.ts`; `src/content/gallery.ts` and `src/content/content.type.ts` (add `gallery.screen.newCompact`)

**Interfaces:**
- Consumes: `BrandLogo` (Task 4), the icons (Task 5), the `shell`/`site` copy (Task 6), `useResolvedTheme`, `useSetTheme`, `ThemeToggle variant="row"`, `Modal`, `IconButton`, `Button`.
- Produces:

  ```ts
  export type TSitePrimaryAction =
    | { kind: "link"; label: string; compactLabel: string; href: string }
    | { kind: "button"; label: string; compactLabel: string; onClick: () => void };
  export interface ISiteShellProps { children: ReactNode; primaryAction?: TSitePrimaryAction }
  export function SiteShell(props: ISiteShellProps): JSX.Element
  ```

  - The default `primaryAction` is `{ kind: "link", label: shell.primary.start, compactLabel: shell.primary.startCompact, href: "/gallery" }`.
  - `SITE_NAV` (header): `[{ href: "/gallery", label: shell.nav.gallery }, { href: "/help", … }, { href: "/about", … }]`.
  - `SITE_FOOTER_LINKS`: gallery, help, about, contact (`/contact`), then GitHub (`site.repoUrl`, `external: true`).
  - `siteType` exports:
    - `display`: `"text-4xl font-bold tracking-tight text-fg md:text-5xl md:leading-[3.25rem]"`
    - `lead`: `"text-lg text-muted"`
    - `section`: `"text-xl font-semibold text-fg"`
    - `pageTitle`: `"text-2xl font-semibold text-fg"`
    - `prose`: `"max-w-prose text-base text-fg-secondary"`
    - `link`: underlined `text-fg` with `focusRing`

- [ ] **Step 1:** Add the `SiteShell` markup:
  1. A skip link to `#main` (`sr-only focus:not-sr-only`).
  2. `<SiteHeader primaryAction>`.
  3. `<main id="main" className={siteShell.main}>{children}</main>`, with `main` as `mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:py-12`.
  4. `<SiteFooter>`.
- [ ] **Step 2:** Build `useSiteHeader()`. It returns:
  - `navItems` (each with `current`, from `usePathname() === href`)
  - `menuOpen`, `openMenu`, `closeMenu` (the menu also closes when the pathname changes)
  - `themeButton: { icon, label, onClick }`: the moon and `toDark` in light, the sun and `toLight` in dark, from `useResolvedTheme`/`useSetTheme`
- [ ] **Step 3:** Build `SiteHeader`, in a row with a `line` bottom border:
  - Logo link to `/` (`BrandLogo`).
  - `nav[aria-label]` with the links, `hidden sm:flex`. The current link gets `aria-current="page"`, `text-fg` and a 2px `line-strong` underline (never the accent); the others are `text-fg-soft`.
  - The theme `IconButton`, `hidden sm:inline-flex`.
  - The primary action as an accent `Link`/`Button`. The label switches by breakpoint with two spans: `hidden sm:inline` and `sm:hidden`.
  - The ☰ `IconButton` (`sm:hidden`), which opens `Modal title={shell.menu.title} size="sm"`. The sheet holds the nav links plus Feedback & contact as 48px rows, then `<ThemeToggle variant="row" />`.
- [ ] **Step 4:** Build `SiteFooter`, three lines in `text-sm text-muted`:
  1. The pencil `BrandLogo variant="pencil" decorative` and the tagline.
  2. A `nav[aria-label=linksLabel]` with the links (44px targets on coarse pointers, wrapping). GitHub is a plain `<a href>`.
  3. The credit and copyright.
- [ ] **Step 5:** Wrap `GalleryScreen` in `<SiteShell primaryAction={{ kind: "button", label: gallery.screen.newArtwork, compactLabel: gallery.screen.newCompact, onClick: () => setModalOpen(true) }}>`. Add `gallery.screen.newCompact = "New"`. Remove the old header, `ThemeToggle` and logo from `GalleryScreen`. Keep the error line, the grid, the import input and the import button, which moves to the heading row in Task 10. Its `<main>` becomes a `div`.
- [ ] **Step 6:** Run `npm run lint && npm run typecheck && npm test`. Expected: PASS.
- [ ] **Step 7: Smoke test** on `/gallery`:
  - **1440:** logo, three links (Gallery marked current), theme button, "New artwork".
  - **390:** logo, "New", ☰. The sheet shows the links and Light/Dark; picking Dark updates the page and the closed header's theme button.
  - **320 × 640:** no horizontal scroll (`document.documentElement.scrollWidth === 320`).
  - **Theme on reload:** switch to dark and reload. The header button shows the sun, with no wrong icon after hydration.
  - **Keyboard:** Tab from the top reaches the skip link first.
- [ ] **Step 8:** Commit `feat(shell): site header, phone menu and footer`, then open the PR `feat/site-shell` with Tasks 4–7.

---

## PR 4 · `feat/gallery-redesign`

### Task 8: Relative time

**Files:**
- Create: `src/features/gallery/logic/relativeTime.ts`, `relativeTime.type.ts`, `relativeTime.test.ts`

**Interfaces:**
- Produces:
  - `export interface IRelativeTimeParts { value: number; unit: "minute" | "hour" | "day" | "month" | "year" }`
  - `export function relativeTimeParts(then: number, now: number): IRelativeTimeParts | null`

- [ ] **Step 1: Write the failing tests:**

  | Elapsed (`now − then`) | Expected |
  |---|---|
  | 0, 59 s, or −10 s (future) | `null` |
  | 60 s | `{1,"minute"}` |
  | 59 min | `{59,"minute"}` |
  | 2 h 5 min | `{2,"hour"}` |
  | 23 h 59 min | `{23,"hour"}` |
  | 24 h | `{1,"day"}` |
  | 29 days | `{29,"day"}` |
  | 30 days | `{1,"month"}` |
  | 364 days | `{12,"month"}` |
  | 365 days | `{1,"year"}` |

- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3: Implement** with floors at the thresholds 60 s, 60 min, 24 h, 30 d and 365 d. A month is 30 days.
- [ ] **Step 4:** Run. Expected: PASS.
- [ ] **Step 5:** Commit `feat(gallery): relative edit time logic`.

### Task 9: Gallery copy and friendlier errors

**Files:**
- Modify:
  - `src/content/gallery.ts`, `src/content/content.type.ts`
  - `src/features/gallery/store/useGalleryStore.ts`
  - `src/features/gallery/hooks/useGalleryImport.ts`

**Interfaces:**
- Produces new `gallery` keys:
  - `screen.heading`, `screen.countLabel(n)`, `screen.storageNote`, `screen.storageLink`, `screen.importFile`, `screen.importLabel`
  - `grid.emptyTitle`, `grid.emptyText`
  - `card.size(w, h)`, `card.edited(relative)`, `card.justNow`
- Removes: `screen.intro`, `screen.importJson`, `grid.empty`.

- [ ] **Step 1:** Set the values from the spec's "Gallery" drafts, verbatim:

  | Key | Value |
  |---|---|
  | `heading` | "Your artworks" |
  | `countLabel` | `n === 1 ? "1 artwork" : \`${n} artworks\`` |
  | `storageNote` | "Saved in this browser only." |
  | `storageLink` | "Learn more" |
  | `importFile` | "Import file" |
  | `importLabel` | "Import an artwork file (.json)" |
  | `emptyTitle` | "No artworks yet" |
  | `emptyText` | "Create your first canvas, or open an artwork file you exported before." |
  | `card.size` | `` `${w} × ${h}` `` |
  | `card.edited` | `` `Edited ${relative}` `` |
  | `card.justNow` | "just now" |
  | `import.success` | "Artwork imported." |
  | `import.failed` | "This file isn't a PixelHB artwork." |

  The `errors` take the spec's six sentences, and `card.clone` becomes "Duplicate".
- [ ] **Step 2:** In `useGalleryStore`, the `load`, `import`, `rename`, `clone` and `delete` failures set `error` to the `gallery.errors.*` copy, never `e.message`. `createArtwork` keeps returning validation messages to the dialog. Add `gallery.toasts = { duplicated: "Artwork duplicated." }` (type `toasts: { duplicated: string }`) and show it with `tone: "success"` from `useGalleryScreen`'s `cloneArtwork` wrapper after the clone resolves.
- [ ] **Step 3:** In `useGalleryImport`, the catch always shows `gallery.import.failed` with `tone: "error"`.
- [ ] **Step 4:** Run `npm run lint && npm run typecheck`. Expected: PASS once Task 10 has stopped reading `intro`, `importJson` and `empty`. Do Tasks 9 and 10 in one commit if the typecheck needs it.

### Task 10: Heading row, cards, empty state, skeletons

**Files:**
- Modify:
  - `src/features/gallery/components/GalleryScreen.tsx`, `GalleryScreen.style.ts`, `useGalleryScreen.ts`
  - `GalleryGrid.tsx`, `GalleryGrid.style.ts`
  - `ArtworkCard.tsx`, `ArtworkCard.style.ts`, `useArtworkCard.ts`
- Create: `src/features/gallery/components/GallerySkeleton.tsx`, `GallerySkeleton.style.ts`, `GallerySkeleton.data.ts`

**Interfaces:**
- Consumes: `relativeTimeParts` (Task 8); the copy (Task 9); `siteType` (Task 7).
- Produces:
  - `useGalleryScreen` returns `count`, `countLabel`, `showSkeleton` (`loading && artworks.length === 0`) and `openCreate` (`() => setModalOpen(true)`, also used by the Task 7 header action), plus the existing fields.
  - `useArtworkCard` returns `size` and `edited`. `edited` is `parts ? new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(-parts.value, parts.unit) : gallery.card.justNow`, wrapped by `gallery.card.edited`.

- [ ] **Step 1:** Heading row:
  - `h1` "Your artworks" in `siteType.pageTitle`, followed by the count: `font-mono text-sm text-muted`, `aria-hidden`, with `countLabel` in an `sr-only` span.
  - On the right, an outline **Import file** with `aria-label={importLabel}`. The row uses `flex flex-wrap items-center justify-between gap-3`.
  - Below it, the storage note in `text-sm text-muted` with a `Link` to `/help#saving`.
- [ ] **Step 2:** Card:
  - Keep the `Card` surface, but give the thumbnail link edge-to-edge corners: no inner padding, `rounded-t-xl`, `bg-surface-muted`, `pixelated`.
  - The body (`p-3 gap-1`) holds the title row from Task 2, then a meta line in `text-xs text-muted`: a `font-mono` size span, " · ", then the edited text.
- [ ] **Step 3:** Empty state:
  - Dashed `line-strong` box with the `pencil` icon, `emptyTitle` in `text-base font-semibold`, and `emptyText`.
  - Buttons: **New artwork** (primary), which calls the same `openCreate` as the header, and **Import file** (outline).
  - `GalleryGrid` gets `onCreate` and `onImport` props for this.
- [ ] **Step 4:** Add `GallerySkeleton`: 4 cards from `GALLERY_SKELETON_KEYS = ["a","b","c","d"]`, each a square `bg-surface-muted` block and two text bars, with `animate-pulse motion-reduce:animate-none`. It has `aria-hidden`, and a `role="status"` sr-only `shared.loading` sits next to it. It shows only when `showSkeleton` is true; otherwise the grid stays mounted during reloads.
- [ ] **Step 5:** Run `npm run lint && npm run typecheck && npm test`. Expected: PASS.
- [ ] **Step 6: Smoke test:**
  - **Empty:** with no artworks, the empty state shows two buttons, and New artwork opens the dialog.
  - **Three artworks:** the count reads 3, and each card shows `64 × 64 · Edited just now`.
  - **Rename and duplicate:** neither makes skeletons flash; the "Artwork duplicated." toast appears.
  - **Long title:** the 60-character title truncates.
  - **Bad import:** importing a `.txt` renamed `.json` shows "This file isn't a PixelHB artwork."
  - Check both themes at 1440 and 390, then run `design:detect` on `/gallery`.
- [ ] **Step 7:** Commit `feat(gallery): heading, card details, empty state and skeletons`, then open the PR.

---

## PR 5 · `feat/site-pages`

### Task 11: Site feature, route group, Home

**Files:**
- Modify:
  - `eslint.config.mjs`: add a `site` zone that blocks `app`, `editor` and `gallery`, and add `site` to the blocked list of the `shared`, `editor` and `gallery` zones (lines 208-228).
  - `src/app/manifest.ts`: `start_url: "/gallery"`.
- Move: `src/app/page.tsx` → `src/app/(site)/page.tsx`
- Create:
  - `src/app/(site)/layout.tsx`, which renders `<SiteShell>{children}</SiteShell>`
  - `src/features/site/components/HomeScreen.tsx`, `HomeScreen.style.ts`, `HomeScreen.data.ts`
  - `src/content/home.ts`

**Interfaces:**
- Consumes: `SiteShell`, `siteType`, `BrandLogo variant="banner" decorative` (Tasks 4, 7).
- Produces:
  - `IHomeContent`:
    - `metaTitle`, `h1`, `lead`, `primary`, `secondary`
    - `promises: { title, text }[]`
    - `insideLabel`, `inside: string[]`
    - `stepsTitle`, `steps: { title, text }[]`
    - `storageNote`, `storageLink`
    - `closingTitle`, `closingCta`
  - `HOME_PROMISE_ICONS = [PUBLIC_ICONS.pencil, PUBLIC_ICONS.lock, PUBLIC_ICONS.download]`

- [ ] **Step 1:** Write `home.ts` with the spec's "Home" drafts verbatim. The "What's inside" items are: Layers, Reference image, Palettes up to 256 colors, Fill, Shift pixels, Pixel grid and center guides, Undo and redo, PNG export. `metaTitle` is `{ absolute: "PixelHB · Pixel art, right in your browser" }`, exported by the page as `metadata`.
- [ ] **Step 2:** Build `HomeScreen`, a server component with these sections:
  1. **Hero** (`grid md:grid-cols-2 gap-10 items-center`):
     - `h1` in `siteType.display`, the lead, then **Start drawing** (accent `Link` to `/gallery`) and **Read the guide** (outline `Link` to `/help`).
     - Art: the banner logo on a `bg-surface` panel with a faint pixel grid. The grid is a `bg-[linear-gradient(var(--color-line)_1px,transparent_1px),linear-gradient(90deg,var(--color-line)_1px,transparent_1px)]` `bg-[size:8px_8px]`, using the banner's 8× cell on md+ and 6× on phones, so the pencil sits on the grid. On phones the art comes first (`order-first md:order-none`).
  2. **Promises:** 3 cards (`sm:grid-cols-3`), each with a 24px `PublicMaskIcon`, a `text-base font-semibold` title and `text-sm text-muted` text.
  3. **What's inside:** a `ul` of `text-sm` chips separated by `·`.
  4. **How it works:** an `ol` of 3 steps, each with its number in `font-mono`.
  5. **Storage note:** a `bg-surface` band with a `Link` to `/help#saving`.
  6. **Closing:** `siteType.section` heading and an accent `Link`.
- [ ] **Step 3:** Run `npm run lint && npm run typecheck`. Expected: PASS. The new site zone is enforced: a test import of `@/features/gallery/...` from `src/features/site` fails lint.
- [ ] **Step 4: Smoke test:**
  - At `/`, both themes, at 1440, 390 and 320: no horizontal scroll, and the banner is crisp (whole-number scale).
  - Start drawing goes to `/gallery`. The tab title is "PixelHB · Pixel art, right in your browser".
  - The manifest at `/manifest.webmanifest` shows `start_url` `/gallery`.
- [ ] **Step 5:** Commit `feat(site): home page`.

### Task 12: About and Feedback & contact

**Files:**
- Create:
  - `src/app/(site)/about/page.tsx`, `src/app/(site)/contact/page.tsx`
  - `src/features/site/components/AboutScreen.tsx`, `AboutScreen.style.ts`
  - `src/features/site/components/ContactScreen.tsx`, `ContactScreen.style.ts`
  - `src/content/about.ts`, `src/content/contact.ts`
- Modify: `src/content/content.type.ts`

**Interfaces:**
- `IAboutContent`:
  - `metaTitle`, `metaDescription`, `h1`, `intro`
  - `sections: { id, title, paragraphs: string[] }[]`
  - `feedbackLink`, `githubLink`, `signature`
- `IContactContent`:
  - `metaTitle`, `metaDescription`, `h1`, `intro`
  - `issue: { title, text, cta }`
  - `email: { title, cta }`
  - `tip`

- [ ] **Step 1:** Write the copy verbatim from the spec. On About:
  - The "Why PixelHB exists" paragraphs, which Hugo approved.
  - The signature `site.author`.
  - The "Source code" section linking `site.repoUrl`.

  On Contact, the email address renders as text plus a `mailto:` link, and the issue card links `site.issuesUrl`. Each page exports `metadata = { title: x.metaTitle, description: x.metaDescription }`, with `metaTitle` "About" and "Feedback & contact" (the template adds "· PixelHB") and `metaDescription` "Who makes PixelHB and why." / "Report a bug, suggest a feature or write to the maker of PixelHB.". Help (Task 14) does the same with "Help" / "How to draw, save and export with PixelHB, plus keyboard shortcuts."
- [ ] **Step 2:** Use a reading layout: `siteType.pageTitle` for the H1, `siteType.prose`, and `siteType.section` H2s with `id`s. The two contact options are `Card`s with the `chat` and `mail` icons, side by side from `sm`.
- [ ] **Step 3:** Run lint and typecheck. Expected: PASS.
- [ ] **Step 4: Smoke test:**
  - Both pages, both themes, at 1440 and 390. The tab titles are "About · PixelHB" and "Feedback & contact · PixelHB".
  - Send feedback on About goes to `/contact`.
  - The issue link opens `…/pixelHB/issues/new`, and the email link is `mailto:hugobenti@gmail.com`.
- [ ] **Step 5:** Commit `feat(site): about and feedback & contact pages`, then open the PR `feat/site-pages` (Tasks 11–12).

---

## PR 6 · `feat/help-and-errors`

### Task 13: Shortcut docs that can't drift

**Files:**
- Create:
  - `src/features/site/logic/keyCombo.ts`, `keyCombo.type.ts`, `keyCombo.test.ts`
  - `src/content/help.ts`
  - `src/content/help.test.ts`
- Modify: `src/content/content.type.ts`

**Interfaces:**
- Produces:

  ```ts
  export type TKeyPlatform = "apple" | "other";
  export interface IKeyCombo { key: string; mod?: boolean; shift?: boolean }
  export function formatKeyCombo(combo: IKeyCombo, platform: TKeyPlatform): string
  ```

  - `IHelpShortcut { action: string; combo: IKeyCombo; effect: "undo" | "redo" | "toggleGrid" | "spacePan" | "arrowPan"; note?: string }`
  - `IHelpContent`:
    - `metaTitle`, `metaDescription`, `h1`, `intro`
    - `sections: { id, title, paragraphs: string[] }[]`
    - `shortcutsTitle`, `shortcutsIntro`
    - `shortcutColumns: { action, keys }`
    - `shortcuts: IHelpShortcut[]`
    - `contactPrompt`, `contactLink`

- [ ] **Step 1: Write the failing tests.**
  - `keyCombo.test.ts`:
    - `{key:"z",mod:true}` gives `"⌘Z"` on apple and `"Ctrl+Z"` on other.
    - `{key:"z",mod:true,shift:true}` gives `"⇧⌘Z"` and `"Ctrl+Shift+Z"`.
    - `{key:"g"}` gives `"G"` on both.
    - `{key:"Space"}` gives `"Space"`.
    - `{key:"Arrows"}` gives `"Arrow keys"` on both.
  - `help.test.ts`: for every `help.shortcuts` entry, build an `IShortcutKeyLike` from the combo (`mod` → `ctrlKey: true`, and separately `metaKey: true`) and assert:
    - `undo`, `redo` and `toggleGrid`: `editorShortcutForKey(event, false)` returns the effect, for both modifiers.
    - `spacePan`: `shouldClaimSpaceForCanvasPan({ code: "Space", target: { tagName: "BODY" }, canvas: null, pointerOverCanvas: true })` is true.
    - `arrowPan`: `keyboardPanDelta(k, false)` is non-null for all four arrows, and `keyboardPanDelta("ArrowLeft", true).dx` is `-128`.
- [ ] **Step 2:** Run both tests. Expected: FAIL (modules missing).
- [ ] **Step 3:** Implement `formatKeyCombo` and write `help.ts`:
  - Shortcuts:
    - "Undo" `{z, mod}`
    - "Redo" `{z, mod, shift}`
    - "Show or hide the pixel grid" `{g}`
    - "Pan while dragging" `{Space}`, note "hold"
    - "Move the canvas" `{Arrows}`, note "Shift for bigger steps; click the canvas first"
  - Sections, with the copy below. Before writing it, check each claim against the code (spec "Left to the builder"):
    - `getting-started`, "Getting started": "Open your gallery and choose New artwork. Name it, pick a size (presets from 16 × 16 to 128 × 128, or type any size up to 1000 × 1000) and a background color. The editor opens right away."
    - `saving`, "Where your work is saved": "PixelHB saves every change automatically in this browser. There's no account, and nothing is uploaded." Then a second paragraph: "Your artworks stay in this browser on this device. Clearing your browsing data deletes them, and they don't show up in a private window, another browser or another device." Then a third: "To keep a copy or move an artwork, open it, go to Settings › Export and choose Export JSON. Open that file later with Import file in your gallery."
    - `export-png`, "Exporting a PNG": "In the editor, open Settings › Export and choose Export PNG to download an image of the visible layers."
    - `phone`, "On a phone": "Pinch with two fingers to zoom. Turn on Pan mode in the toolbar to move around with one finger, and turn it off to draw again."
    - `limits`, "Limits": "Canvases go up to 1000 × 1000 pixels, and each artwork's palette holds up to 256 colors."
  - Then `contactPrompt` "Something not working, or missing?" and `contactLink` "Tell me on the Feedback & contact page".
- [ ] **Step 4:** Run both tests. Expected: PASS. Then change a combo to `{key:"y", mod:true}` and confirm `help.test.ts` fails. Revert.
- [ ] **Step 5:** Commit `feat(help): shortcut docs checked against the editor's key handling`.

### Task 14: Help page, 404 and error page

**Files:**
- Create:
  - `src/app/(site)/help/page.tsx`
  - `src/features/site/components/HelpScreen.tsx`, `HelpScreen.style.ts`
  - `ShortcutKeys.tsx`, `useShortcutKeys.ts`
  - `src/app/not-found.tsx`, `src/app/error.tsx`
  - `src/features/site/components/StatusScreen.tsx`, `StatusScreen.style.ts`, `StatusScreen.type.ts`
  - `src/content/statusPages.ts`
- Modify: `src/content/content.type.ts`

**Interfaces:**
- Consumes: `formatKeyCombo`, `help` (Task 13), `SiteShell`.
- Produces:
  - `useShortcutKeys(combo: IKeyCombo): string`. It runs `"use client"` and uses `useSyncExternalStore` over `navigator.platform`/`userAgentData`, so its server snapshot is `"other"`. It returns `formatKeyCombo(combo, platform)`.
  - `IStatusScreenProps { title: string; text: string; onRetry?: () => void }`. It renders inside `SiteShell`, with **Go to your gallery** (accent `Link`), a home link, and, when `onRetry` is set, **Try again** (outline).
  - `statusPages`:
    - `notFound`:
      - `title` "This page doesn't exist."
      - `text` "The link may be broken, or the page was moved."
    - `error`:
      - `title` "Something went wrong."
      - `text` "Your artworks are safe in this browser."
      - `retry` "Try again"
    - Shared: `gallery` "Go to your gallery", `home` "Back to the home page", `metaTitle` "Page not found".

- [ ] **Step 1:** Build `HelpScreen` in the reading layout:
  - A table of contents (anchor links to each section `id`).
  - The sections.
  - The shortcuts as a `table`: the action in the first column, the keys in a `<kbd>` styled `font-mono text-xs rounded-sm border border-control-border px-1.5`. The keys come from `ShortcutKeys`, and the note sits in `text-xs text-muted`.
  - The contact prompt.
- [ ] **Step 2:** Add `not-found.tsx`, which renders `<SiteShell><StatusScreen …notFound /></SiteShell>` and exports `metadata = { title: statusPages.metaTitle }`. Add `error.tsx` with `"use client"` and props `{ error, unstable_retry }` (Next 16.2): `<SiteShell><StatusScreen …error onRetry={unstable_retry} /></SiteShell>`.
- [ ] **Step 3:** Run lint, typecheck and test. Expected: PASS.
- [ ] **Step 4: Smoke test:**
  - `/help` in both themes at 1440 and 390. In the Chromium UA the shortcut table shows "Ctrl+Z"; with an emulated Mac UA it shows "⌘Z".
  - `/help#saving` scrolls to its section.
  - `/nope` shows the branded 404 inside the header and footer, and the tab title is "Page not found · PixelHB".
  - For the error page, temporarily throw in `HomeScreen` in dev to see it with Try again, then remove the throw.
  - Run `design:detect` on `/`, `/about`, `/help` and `/contact` at both viewports.
- [ ] **Step 5:** Commit `feat(site): help, 404 and error pages`, then open the PR `feat/help-and-errors`.

---

## PR 7 · `docs/presentation`

### Task 15: Docs match the shipped product

**Files:**
- Modify:
  - `DESIGN.md`: Typography hierarchy (272-280), Layout (285-293), Cards (342-349), Feedback (394-399), Theme Toggle (382-385); new "Site header and footer" and "Site pages" sections
  - `PRODUCT.md`: Operating Context, plus line 22
  - `docs/design/brand.md`: line 20 and line 187
  - `docs/design/improvement-plan.md`: PR 3 section (94-101)

- [ ] **Step 1:** Update DESIGN.md:
  - Add the Display, Lead and Section styles with their classes from `siteType`.
  - Gallery layout moves into `SiteShell`. Cards get the meta line and the `⋯` on the title row.
  - Menu: phone sheet, plus the dropdown flip.
  - Empty state and skeletons.
  - Theme control: an icon button in the header, Light/Dark in the phone sheet.
  - Header, footer and reading-page rules.
- [ ] **Step 2:** Update PRODUCT.md:
  - Surfaces now include Home, Help, About, Contact, 404 and error.
  - Line 22: "works offline" becomes "works without an account"; "symmetry guides" becomes "center guides".
- [ ] **Step 3:** Update brand.md:
  - Line 20 becomes "No mascot or illustration set; no marketing site beyond the home page."
  - Line 187: the gallery header now uses the shared site header (the logo is a link to `/`, the page H1 is "Your artworks").
- [ ] **Step 4:** In improvement-plan.md, mark PR 3 "Covered by docs/design/presentation.md".
- [ ] **Step 5:** Run `npm run lint`. Expected: PASS (Prettier is clean on md). Commit `docs: presentation shell, pages and copy`, then open the PR.
