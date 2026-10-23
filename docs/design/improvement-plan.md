# PixelHB UI improvement plan

Date: Oct 22, 2026, on `main` at `d815755` (after the presentation-component refactor).
Scope: every screen, in both themes, at 1440 and 390 wide. Keep: the color tokens (Paper & Ink / Studio Dark), Schibsted Grotesk + JetBrains Mono, and the architecture rules in AGENTS.md.

Evidence: the finding IDs below come from two audits run for this plan: a Vercel Web Interface Guidelines review (75 findings, IDs `X- M- T- F- G- E- C- P- L- S- D-`) and an Impeccable audit + critique (55 findings, IDs `F- IC- GA- ED- CV- DR- LY- ST- PA- CR-`; where `F-` IDs collide this plan writes the Impeccable ones as `F-0x(imp)`), with screenshots of every screen in both themes at 1440 and 390. The raw audits and screenshots were working files and are not in the repo; each PR description restates the evidence for the findings it fixes.

- The detector (`npm run design:detect`) passes on source and on every live screen except one advisory. The ugliness comes from things no rule checks: layout, hierarchy, how components are built, and craft.

## Why it looks bad: five root causes

1. **No app shell, no workspace.** The editor is a 1152px centered column with two stacked bars and a boxed canvas. The gallery is a page of form-style cards. Nothing frames the product, and "PixelCraft" appears nowhere on screen. (ED-06, CV-02, GA-09)
2. **The accent is used for state.** Every active toggle becomes a filled primary button, so up to six accent fills show at once. Add layer, the "Primary" slot word-button and the red Delete on every card all compete with the artwork. (ED-01, ED-02, LY-01, GA-01)
3. **Primitives are missing, so everything is ad hoc.** There's no IconButton with a pressed state, no ConfirmDialog (the browser's `window.confirm` shows white in dark mode), no Switch, no overflow menu, and no color/hex field. Layer rows hand-roll their own buttons. Dialogs come in four close styles, three paddings and two heading sizes. (LY-02, F-04/05/06(imp), GA-04, PA-02)
4. **Hierarchy is flat.** Body text falls back to 16px, so headings, body and titles are all 16. Mono is loaded but used zero times, and nothing shows the zoom level, sizes or hex values. Icons come from three different sets. (F-02(imp), ED-04, IC-01)
5. **The artwork is badly served.** Thumbnails are 150px lossy WebP files stretched to 228–324px, blurry and with baked-in seams. Drawers and modals dim or blur the canvas while you change it. The checkerboard fills the whole viewport. (GA-02, DR-01, PA-01, CV-01)

## Target look

The same palette and fonts, rebuilt as a modern creative tool: the canvas fills the screen, the chrome is thin and quiet, one accent marks the primary action, pressed states use surface steps, there's one outline icon family, and every number is in mono.

```svg
<svg viewBox="0 0 980 430" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
  <text x="0" y="14" fill="var(--muted)" font-size="13">Desktop editor (≥1024)</text>
  <rect x="0" y="24" width="640" height="400" rx="8" fill="none" stroke="var(--border)"/>
  <rect x="0" y="24" width="640" height="40" rx="8" fill="var(--surface)" stroke="var(--border)"/>
  <text x="14" y="49" fill="currentColor">‹  Slime ✎   · Saved</text>
  <text x="270" y="49" fill="var(--muted)">↶ ↷   −  100%  +  ⤢</text>
  <rect x="530" y="33" width="44" height="22" rx="5" fill="none" stroke="var(--border)"/><text x="537" y="48" fill="var(--muted)">Export</text>
  <text x="590" y="49" fill="var(--muted)">⚙ ⋯</text>
  <rect x="0" y="64" width="48" height="360" fill="var(--surface)" stroke="var(--border)"/>
  <rect x="9" y="76" width="30" height="30" rx="6" fill="var(--border)"/><text x="17" y="96" fill="currentColor">✎</text>
  <text x="18" y="132" fill="var(--muted)">▣</text><text x="18" y="164" fill="var(--muted)">✋</text><text x="18" y="196" fill="var(--muted)">⇆</text>
  <rect x="10" y="372" width="20" height="20" rx="3" fill="var(--c1)"/><rect x="20" y="382" width="20" height="20" rx="3" fill="var(--c4)" stroke="var(--surface)"/>
  <rect x="48" y="64" width="372" height="360" fill="none"/>
  <rect x="149" y="124" width="170" height="170" fill="var(--c3)" opacity="0.35" stroke="var(--border)"/>
  <text x="196" y="214" fill="currentColor">artwork</text>
  <text x="166" y="410" fill="var(--muted)">checker only under artwork</text>
  <rect x="420" y="64" width="220" height="360" fill="var(--surface)" stroke="var(--border)"/>
  <text x="432" y="86" fill="currentColor" font-weight="bold">Palette</text><text x="604" y="86" fill="var(--muted)">5/256</text>
  <rect x="432" y="96" width="22" height="22" rx="4" fill="var(--c1)"/><rect x="460" y="96" width="22" height="22" rx="4" fill="var(--c2)"/><rect x="488" y="96" width="22" height="22" rx="4" fill="var(--c3)"/><rect x="516" y="96" width="22" height="22" rx="4" fill="var(--c4)"/><rect x="544" y="96" width="22" height="22" rx="4" fill="none" stroke="var(--border)" stroke-dasharray="3 2"/><text x="550" y="112" fill="var(--muted)">+</text>
  <rect x="432" y="126" width="196" height="24" rx="5" fill="none" stroke="var(--border)"/><text x="440" y="142" fill="var(--muted)" font-family="monospace">#3FA34D</text>
  <line x1="420" y1="164" x2="640" y2="164" stroke="var(--border)"/>
  <text x="432" y="186" fill="currentColor" font-weight="bold">Layers</text><text x="616" y="186" fill="var(--muted)">+</text>
  <rect x="428" y="196" width="204" height="36" rx="6" fill="var(--border)" opacity="0.6"/><text x="440" y="219" fill="currentColor">▦ Layer 2      👁 ⋯</text>
  <text x="440" y="255" fill="var(--muted)">▦ Layer 1      👁 ⋯</text>
  <text x="432" y="410" fill="var(--muted)">docked, no scrim</text>
  <text x="700" y="14" fill="var(--muted)" font-size="13">Phone editor (390)</text>
  <rect x="700" y="24" width="200" height="400" rx="16" fill="none" stroke="var(--border)"/>
  <rect x="700" y="24" width="200" height="36" rx="16" fill="var(--surface)" stroke="var(--border)"/>
  <text x="712" y="47" fill="currentColor">‹ Slime</text><text x="812" y="47" fill="var(--muted)">↶ ↷ ⋯</text>
  <rect x="740" y="120" width="120" height="120" fill="var(--c3)" opacity="0.35" stroke="var(--border)"/>
  <text x="772" y="185" fill="currentColor">artwork</text>
  <rect x="700" y="340" width="200" height="84" rx="16" fill="var(--surface)" stroke="var(--border)"/>
  <rect x="712" y="350" width="16" height="16" rx="3" fill="var(--c1)"/><rect x="734" y="350" width="16" height="16" rx="3" fill="var(--c2)"/><rect x="756" y="350" width="16" height="16" rx="3" fill="var(--c3)"/><rect x="778" y="350" width="16" height="16" rx="3" fill="var(--c4)"/><text x="800" y="363" fill="var(--muted)">› palette strip</text>
  <text x="712" y="400" fill="var(--muted)">✎  ▣  ✋  ⇆   ■□   ▤</text>
  <text x="712" y="416" fill="var(--muted)" font-size="10">tools · FG/BG · layers (44px targets)</text>
</svg>
```

Gallery: an app header (logo/name, theme in a menu, "New artwork" as the single primary action). Cards are full-bleed pixelated thumbnails with title + `16 × 16 · edited 2h ago` in mono, and one `⋯` menu (Rename, Clone, Export, Delete). An empty state with a CTA and an Import action, and skeleton cards while loading.

## Plan: 7 PRs, in order (each ≤ ~20 files, CI green, reviewed by Hugo)

### PR 1 · Foundations and bug fixes (deterministic, no layout change)

| Fix                                                                                                                                            | Findings              |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| Focus ring uses the `focus` token (currently browser blue in both themes); fix the false DESIGN.md line about it                               | X-02, F-01(imp)       |
| New `control-border` token (input, outline button and idle swatch borders are 1.75:1, need 3:1); add it to the contrast test                   | X-01                  |
| Swatch ring offset uses `bg` (white halo in dark); first swatch's ring no longer clipped                                                       | C-01, C-02, ED-05     |
| Layer row icons follow the theme (`<img>` with hard-coded gray, white square in dark)                                                          | L-01                  |
| Thumbnails: lossless PNG at integer scale, `image-rendering: pixelated`, `object-contain`, no seams                                            | G-05, GA-02           |
| `body` gets `text-sm` (14/20) so the type scale isn't flat at 16                                                                               | F-02(imp)             |
| Base styles: `::selection`, `scrollbar-color`, `caret-color`, `text-wrap` balance/pretty; `theme-color` meta per theme; per-document `<title>` | F-03(imp), X-05, X-06 |
| Create-artwork errors show inside the modal (today they render behind it, and invalid numbers fail silently)                                   | G-01                  |
| Editor load failure shows an error with a way back, instead of "Loading…" forever; autosave flushes on `pagehide` / `visibilitychange`         | E-01, E-02            |
| Palette index base: image detail says "#0", the toolbar says "1"                                                                               | ST-06                 |
| Remove the leftover Next.js template SVGs from `public/` (favicon waits for the rename, see PR 3)                                              | (own check)           |

### PR 2 · Missing primitives (shared/components)

| Primitive                                                                                                                                                                                                         | Replaces / fixes               |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| `IconButton` with `pressed` state (`surface-strong` + inset ring, never the accent), 40px and 44px on coarse pointers                                                                                             | ED-01, LY-02, X-03, E-06       |
| `ConfirmDialog` (names the target, danger fill only here) + Undo toast                                                                                                                                            | G-03, GA-04, S-05, P-01, PA-03 |
| `Menu` (overflow `⋯`)                                                                                                                                                                                             | GA-01, G-02                    |
| `Switch` row                                                                                                                                                                                                      | S-02, ST-01                    |
| `Modal` skeleton: one padding (`p-5 gap-4`), header with title + X, footer, `text-base` heading, enter/exit fade, `85dvh` + `overscroll-contain`, `aria-labelledby` built in, edge-to-edge bottom sheet on phones | F-04/05/06(imp), M-01..M-04    |
| `FormField` error slot; `NumberField` (mono, tabular, real validation); `ColorField` (swatch + hex input in mono, no native double frame)                                                                         | F-01, F-02, F-04, P-03, PA-02  |
| Toast: X icon at a 32px target, `role=alert` for errors, pause on hover, bottom position on phones                                                                                                                | T-01..T-03                     |
| One icon family: 24-grid, 1.5 stroke, `currentColor`; distinct icons for Export / Load image and Shift / Canvas size; no `←` `×` `↑` glyphs                                                                       | IC-01..IC-04, E-05, D-01       |

### PR 3 · App shell + gallery redesign

**Covered by [`docs/design/presentation.md`](presentation.md).**

- Shared `AppHeader`: brand, theme control moved into a menu (out of the action row), primary action. Fixes the phone header where "New artwork" wraps alone onto its own row. (G-08, GA-07)
- `ArtworkCard`: full-bleed thumbnail, no card-in-card, title + mono metadata (size, last edited), the whole card links to the editor, one `⋯` Menu, inline rename that fits the card, accessible names include the artwork title. (GA-01, GA-05, GA-06, G-04, G-06, G-11)
- Empty state with an illustration-free mark, "New artwork" + "Import JSON"; skeleton loading; error banner with Retry; clone toast. (G-07, GA-03, G-09, G-10, G-13)
- Copy: "Saved in this browser. Nothing is uploaded." instead of the IndexedDB jargon; errors that say how to recover. (G-12, GA-08, X-09)
- Rhythm: lighter header, no heavy divider, consistent gaps. (GA-09)

### PR 4 · Editor workspace (desktop)

- Full-bleed layout: a 48px top bar (back icon, editable title, save status, undo/redo, zoom − **100%** + fit in mono, Export, settings). (ED-06, CV-02, ED-04, E-07, ED-11, E-08)
- A left tool rail with explicit tools (brush, bucket, pan, shift) using the IconButton pressed state, with shortcut hints in tooltips and new keyboard shortcuts. (ED-03, E-10)
- An FG/BG color chip with swap replaces the "Primary"/"Secondary" word button. (E-04, ED-02, C-03)
- A docked right inspector (palette + layers), with no scrim, at ≥1024px. Settings becomes a narrower popover/panel, so the grid and layer toggles show their effect live. (DR-01, DR-02, PA-01)
- Checkerboard only under the artwork. Calmer symmetry guides. (CV-01)

### PR 5 · Editor on phone

- A 48px top bar plus a bottom dock (tools, FG/BG, palette strip, layers), within thumb reach, with 44px targets and safe-area insets. Zoom buttons hidden (pinch covers them). Editor chrome goes from 208px (25% of the screen) to about 130px. (ED-07, E-03, X-10, X-03)
- Layers and settings open as bottom sheets. (M-02)

### PR 6 · Panels and forms

- **Layers:** compact rows, a hidden-layer state (dimmed + eye-off), actions in a row menu including **Delete layer** (missing today), names in action labels, a visible drag hint on touch, no drag text selection, no shadow on previews, Add as an icon in the panel header. (LY-01..LY-04, L-02..L-09)
- **Palette:** an inline editor in the inspector: swatch grid that fits 390px, add tile, hex field, `n/256` count, remove → ConfirmDialog/Undo. (P-02..P-05, PA-04)
- **Settings:** grouped sections (Canvas, Reference image, Document, App) with Switch rows and hover states; the disabled hint stays readable. (S-01, S-03, ST-02, ST-03)
- **Canvas size:** a real `<form>`, inline errors, ConfirmDialog for shrinking with the history warning prominent. (S-04, S-05, ST-04)
- **Export:** single heading, busy state on PNG export. **Image detail:** mono, locale-formatted numbers, checkerboard swatch for transparent. (ST-05, S-10, S-11, S-06..S-08)
- **New artwork:** size presets (16 / 32 / 64 / 128), mono NumberFields, ColorField, one concise hint. (CR-01, F-02, F-03)
- **Shift pixels:** a pad that follows the theme, a caption, icon arrows. (ED-10, D-01, D-02)

### PR 7 · Polish + spec update

- Type migration (labels 13/16, headings all on the scale, one weight for user-content names), radius vocabulary `sm/md/lg/xl` only (drop `rounded`, `rounded-full`), shadow vocabulary (drop `shadow-inner` and the shadow on pixel previews), two control heights (40 / 32), aligned drawer gutters. (F-06..F-09(imp), DR-03, DR-04, ED-09)
- Motion: one shared duration/easing token for drawers, modals and toasts, opacity-only under reduced motion. (DR-05, M-03)
- Copy/i18n: curly quotes, ⌘ vs Ctrl per platform, `translate="no"` on user names. (X-07, X-08)
- Rewrite DESIGN.md Components + Layout for the new shell, and re-run `design:detect` plus both skills before closing.

## Decisions (Hugo, Oct 22, 2026)

1. **Desktop panels:** a docked inspector with no scrim, at ≥1024px.
2. **Name:** the product is renamed **PixelHB** (spec: [`brand.md`](brand.md)). The brand work (logo, favicon and app icons, metadata, `src/content/site.ts`) ships in its own PRs ahead of PR 3; PR 3's `AppHeader` reuses the logo component.
3. **Behavior changes:** Delete layer, undo for palette Remove, and keyboard shortcuts for tools are all in scope.
