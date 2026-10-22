---
name: PixelCraft
description: A local-first browser pixel-art editor; warm paper by day, warm graphite by night, the artwork always leads.
colors:
  bg: "#ece9e1"
  surface: "#fcfbf7"
  surface-subtle: "#f6f4ee"
  surface-muted: "#efece5"
  surface-strong: "#e3dfd5"
  surface-inverse: "#1c1e26"
  scrim: "#17181d"
  line: "#dcd8cd"
  line-strong: "#c5c0b3"
  control-border: "#857f73"
  fg: "#1a1c24"
  fg-soft: "#262832"
  fg-secondary: "#3a3c46"
  muted: "#52535c"
  subtle: "#66666c"
  accent: "#2b3a9e"
  accent-hover: "#202c7d"
  on-accent: "#fcfbf7"
  focus: "#2b3a9e"
  pick-primary: "#2b3a9e"
  pick-secondary: "#b4500f"
  danger: "#b3261e"
  danger-hover: "#8e1d17"
  on-danger: "#fcfbf7"
  danger-surface: "#faeee9"
  danger-line: "#ecc3b8"
  danger-fg: "#8e1d17"
  danger-fg-strong: "#4a0f0b"
  success-surface: "#edf2e6"
  success-line: "#bfd2b0"
  success-fg: "#234a1c"
  checker-light: "#e8e6e0"
  checker-dark: "#d3d0c8"
  grid-line: "color-mix(in srgb, var(--color-fg) 24%, transparent)"
  guide-horizontal: "#c0261d"
  guide-vertical: "#2b3a9e"
  bg-dark: "#141312"
  surface-dark: "#1c1b19"
  surface-subtle-dark: "#22211f"
  surface-muted-dark: "#292826"
  surface-strong-dark: "#353330"
  surface-inverse-dark: "#ece8e1"
  scrim-dark: "#000000"
  line-dark: "#2f2d2a"
  line-strong-dark: "#46433f"
  control-border-dark: "#78736b"
  fg-dark: "#efebe5"
  fg-soft-dark: "#ddd8d0"
  fg-secondary-dark: "#c3bdb4"
  muted-dark: "#a7a198"
  subtle-dark: "#948e85"
  accent-dark: "#eda743"
  accent-hover-dark: "#f5bb64"
  on-accent-dark: "#1b1307"
  focus-dark: "#f5bb64"
  pick-primary-dark: "#eda743"
  pick-secondary-dark: "#7cb2ff"
  danger-dark: "#f0605f"
  danger-hover-dark: "#ff7d7a"
  on-danger-dark: "#1d0707"
  danger-surface-dark: "#2a1717"
  danger-line-dark: "#5e2c2a"
  danger-fg-dark: "#ff8e8a"
  danger-fg-strong-dark: "#ffcdc9"
  success-surface-dark: "#15231a"
  success-line-dark: "#2d4a36"
  success-fg-dark: "#8fdca7"
  checker-light-dark: "#3a3835"
  checker-dark-dark: "#2d2b29"
  grid-line-dark: "color-mix(in srgb, var(--color-muted) 34%, transparent)"
  guide-horizontal-dark: "#ff5c5c"
  guide-vertical-dark: "#5fa8ff"
typography:
  page-title:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, sans-serif"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: "32px"
  section-heading:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: "24px"
  body:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
  label:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: "16px"
  caption:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "16px"
  numeric:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: "16px"
rounded:
  sm: "4px"
  md: "6px"
  lg: "10px"
  xl: "12px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.lg}"
    padding: "8px 12px"
    height: "40px"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.fg-soft}"
    rounded: "{rounded.lg}"
    padding: "8px 12px"
    height: "40px"
  button-ghost-hover:
    backgroundColor: "{colors.surface-muted}"
  button-outline:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.fg-soft}"
    rounded: "{rounded.lg}"
    padding: "8px 12px"
    height: "40px"
  button-outline-hover:
    backgroundColor: "{colors.surface-subtle}"
  button-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.on-danger}"
    rounded: "{rounded.lg}"
    padding: "8px 12px"
    height: "40px"
  button-danger-hover:
    backgroundColor: "{colors.danger-hover}"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.xl}"
  modal:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.xl}"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.fg}"
    rounded: "{rounded.lg}"
    padding: "8px 12px"
  color-swatch:
    rounded: "{rounded.md}"
    size: "40px"
---

# Design System: PixelCraft

## Overview

**Creative North Star: "The Sketchbook and the Darkroom"**

PixelCraft is one studio seen under two lighting conditions. By day it is a sketchbook on a desk: warm off-white paper, ink-dark text and a single ultramarine ink accent. By night it is a darkroom: warm graphite chrome that steps back so the work glows, with amber as the only warm signal. The furniture never moves between the two; only the light changes. Whatever the lighting, the artwork is always the brightest, most saturated thing on screen.

The chrome is quiet, low-chroma and compact enough to leave the canvas room on a phone. Users stare at arbitrary, saturated palette colors for long stretches, so every neutral is a warm gray close to true neutral, every surface is flat, and there is exactly one accent per theme. One type system serves both themes: Schibsted Grotesk for the interface, JetBrains Mono for numbers. Switching theme changes color only, never metrics, so there is no layout shift.

This system replaces the earlier blue-gray theme (a `#cfd9df` page that tinted the palette, zinc grays, Arial overriding Geist, a solid red Delete on every card). How the two themes were chosen is recorded in `docs/design/explorations.md`.

**Key Characteristics:**

- Two themes, one set of semantic token names; light is "Paper & Ink", dark is "Studio Dark".
- Default theme follows the OS; the user can override it, and the choice persists.
- Warm, low-chroma neutrals; never a tinted surface behind the artwork.
- One accent per theme: ultramarine `#2b3a9e` in light, amber `#eda743` in dark.
- Depth by a soft shadow in light, by surface steps in dark.
- Every token pair meets WCAG 2.2 AA in both themes, enforced by a test.

## Colors

Warm paper and ink by day, warm graphite and amber by night: neutrals that stay out of the artwork's way, and one accent that marks what you can act on.

### Primary

- **Ultramarine Ink** (`#2b3a9e`, light) / **Studio Amber** (`#eda743`, dark): `accent`. The fill of the primary button and the primary-slot swatch ring (`pick-primary`). In light, the focus ring is the same ultramarine; in dark, focus uses the brighter amber `#f5bb64` (`accent-hover`) so it reads on graphite.

### Secondary

- **Burnt Orange** (`#b4500f`, light) / **Sky Blue** (`#7cb2ff`, dark): `pick-secondary`. Only the ring around the secondary-slot swatch. Never a button, link or text color.

### Neutral

- **Desk Paper** (`#ece9e1`) / **Graphite Night** (`#141312`): `bg`, the page.
- **Sheet** (`#fcfbf7`) / **Graphite** (`#1c1b19`): `surface`, cards, modal, drawers, inputs.
- **Ink** (`#1a1c24`) / **Chalk** (`#efebe5`): `fg`, primary text.
- **Hairline** (`#dcd8cd`) / (`#2f2d2a`): `line`, dividers and sheet borders.

### Status

- **Oxblood** (`#b3261e`) / **Coral** (`#f0605f`): `danger`, destructive actions. Status colors (danger, success) are reserved for state, never decoration.

### Token table

Every color token, as declared in `src/app/globals.css`. Light values are the `@theme static` block; dark values are the `[data-theme="dark"]` overrides.

| Token              | Light                                                  | Dark                                                      | Role                                                                    |
| ------------------ | ------------------------------------------------------ | --------------------------------------------------------- | ----------------------------------------------------------------------- |
| `bg`               | `#ece9e1`                                              | `#141312`                                                 | Page background                                                         |
| `surface`          | `#fcfbf7`                                              | `#1c1b19`                                                 | Cards, modal, drawers, inputs, outline buttons                          |
| `surface-subtle`   | `#f6f4ee`                                              | `#22211f`                                                 | Outline-button and layer-row hover, settings panel wells                |
| `surface-muted`    | `#efece5`                                              | `#292826`                                                 | Ghost-button hover, thumbnail well, pressed outline button              |
| `surface-strong`   | `#e3dfd5`                                              | `#353330`                                                 | Highest surface step; transparent-color swatch in the image detail list |
| `surface-inverse`  | `#1c1e26`                                              | `#ece8e1`                                                 | Inverse surface: the editor's shift-direction arrow pad                 |
| `scrim`            | `#17181d`                                              | `#000000`                                                 | Overlay behind modals (40%) and drawers (45%), never a surface          |
| `line`             | `#dcd8cd`                                              | `#2f2d2a`                                                 | Sheet borders, dividers                                                 |
| `line-strong`      | `#c5c0b3`                                              | `#46433f`                                                 | Drawer edge, layer-row controls, empty-state dashes                     |
| `control-border`   | `#857f73`                                              | `#78736b`                                                 | Input and outline-button borders, idle swatch ring (≥ 3:1, WCAG 1.4.11) |
| `fg`               | `#1a1c24`                                              | `#efebe5`                                                 | Primary text, headings                                                  |
| `fg-soft`          | `#262832`                                              | `#ddd8d0`                                                 | Button labels, header icons                                             |
| `fg-secondary`     | `#3a3c46`                                              | `#c3bdb4`                                                 | Form labels                                                             |
| `muted`            | `#52535c`                                              | `#a7a198`                                                 | Secondary copy, intro lines, empty states                               |
| `subtle`           | `#66666c`                                              | `#948e85`                                                 | Hints, placeholders, captions                                           |
| `accent`           | `#2b3a9e`                                              | `#eda743`                                                 | Primary button fill, "both slots" swatch ring, active layer row border  |
| `accent-hover`     | `#202c7d`                                              | `#f5bb64`                                                 | Primary button hover (darker in light, brighter in dark)                |
| `on-accent`        | `#fcfbf7`                                              | `#1b1307`                                                 | Text on `accent`                                                        |
| `focus`            | `#2b3a9e`                                              | `#f5bb64`                                                 | Focus outlines and input focus ring                                     |
| `pick-primary`     | `#2b3a9e`                                              | `#eda743`                                                 | Primary-slot swatch ring                                                |
| `pick-secondary`   | `#b4500f`                                              | `#7cb2ff`                                                 | Secondary-slot swatch ring                                              |
| `danger`           | `#b3261e`                                              | `#f0605f`                                                 | Destructive button fill                                                 |
| `danger-hover`     | `#8e1d17`                                              | `#ff7d7a`                                                 | Destructive button hover                                                |
| `on-danger`        | `#fcfbf7`                                              | `#1d0707`                                                 | Text on `danger`                                                        |
| `danger-surface`   | `#faeee9`                                              | `#2a1717`                                                 | Error line and error toast background                                   |
| `danger-line`      | `#ecc3b8`                                              | `#5e2c2a`                                                 | Error toast border                                                      |
| `danger-fg`        | `#8e1d17`                                              | `#ff8e8a`                                                 | Error text                                                              |
| `danger-fg-strong` | `#4a0f0b`                                              | `#ffcdc9`                                                 | Error toast text                                                        |
| `success-surface`  | `#edf2e6`                                              | `#15231a`                                                 | Success toast background                                                |
| `success-line`     | `#bfd2b0`                                              | `#2d4a36`                                                 | Success toast border                                                    |
| `success-fg`       | `#234a1c`                                              | `#8fdca7`                                                 | Success toast text                                                      |
| `checker-light`    | `#e8e6e0`                                              | `#3a3835`                                                 | Transparency checkerboard, light squares                                |
| `checker-dark`     | `#d3d0c8`                                              | `#2d2b29`                                                 | Transparency checkerboard, dark squares                                 |
| `grid-line`        | `color-mix(in srgb, var(--color-fg) 24%, transparent)` | `color-mix(in srgb, var(--color-muted) 34%, transparent)` | Editor pixel grid (canvas renderer)                                     |
| `guide-horizontal` | `#c0261d`                                              | `#ff5c5c`                                                 | Horizontal symmetry guide (canvas renderer)                             |
| `guide-vertical`   | `#2b3a9e`                                              | `#5fa8ff`                                                 | Vertical symmetry guide (canvas renderer)                               |

### Theming

- **Default and override.** The theme follows `prefers-color-scheme` until the user picks one. The choice is stored in `localStorage` under `pixelcraft-theme` as `"light"` or `"dark"`; no key means "follow the system". The preference logic lives in `src/features/shared/theme/`: `themePreference.ts` (pure parse/resolve helpers and the pre-paint script, unit-tested) and `useThemePreference.ts` (hooks `useThemePreference`, `useResolvedTheme`, `useThemeSync`).
- **Switch.** The resolved theme is written to `data-theme` on `<html>`. An inline script rendered in `<head>` by `src/app/layout.tsx` sets it before first paint, so there is no flash of the wrong theme. `useThemeSync` (called in `src/app/AppProviders.tsx`) keeps it in sync when the OS setting changes while the user follows the system.
- **Tokens.** Light values live in the `@theme static` block of `src/app/globals.css`; dark values override the same `--color-*` custom properties under `[data-theme="dark"]`, which also sets `color-scheme: dark`. Tailwind utilities (`bg-surface`, `text-muted`, `outline-focus`) resolve to whichever value is active.
- **Canvas.** The editor's canvas renderers read the grid and guide colors from the CSS variables (`--color-grid-line`, `--color-guide-horizontal`, `--color-guide-vertical`) and re-read them when the resolved theme changes.
- **Contrast.** `src/app/tokenContrast.test.ts` checks the same pair list against both token sets: text pairs at 4.5:1, UI pairs (focus, accent, danger, swatch rings, `control-border` on `bg` / `surface` / `surface-subtle`, guides on the checkerboard, `surface` on `surface-inverse`) at 3:1. It also fails if the dark block leaves any color token undefined, so a light value can never leak into dark.

### Named Rules

**The Artwork Leads Rule.** The artwork is the brightest, most saturated thing on screen. Chrome stays low-chroma; surfaces are warm neutrals and are never tinted with a hue. No colored page backgrounds, gradients, glows or textures behind or around the canvas.

**The One Accent Rule.** Ultramarine in light, amber in dark. The accent marks the primary action and the primary-slot swatch ring; the only other use is the border of the active layer row, which is a selection of the same kind. Never decoration, headings, links or body text. One primary button per view; everything else is ghost or outline.

**The Tokens Only Rule.** Both themes come from the same semantic token names. Components use the token utilities and never branch on theme: no `dark:` variants, no `if (theme === "dark")` in style files or renderers, no hex literals. A color that looks wrong in one theme is fixed in that theme's token value.

## Typography

**UI Font:** Schibsted Grotesk (with `ui-sans-serif, sans-serif`)
**Numbers Font:** JetBrains Mono (with `ui-monospace, monospace`)

**Character:** A sturdy, slightly editorial grotesk that stays crisp in a dense toolbar, paired with a monospace for anything the user measures. The same faces and metrics in both themes, so a theme switch never reflows a line.

### Hierarchy

- **Page title** (Schibsted Grotesk 600, 24px / 32px; `text-2xl font-semibold`): one per screen, the gallery heading.
- **Section heading** (Schibsted Grotesk 600, 16px / 24px; `text-base font-semibold`): drawer and modal headings.
- **Body** (Schibsted Grotesk 400, 14px / 20px; `text-sm`): descriptions, intro lines, form text.
- **Label / button** (Schibsted Grotesk 500, 13px / 16px): button labels, field labels, toggles. Until a migration lands, labels and buttons use `text-sm` (14px / 20px), as they do today.
- **Caption** (Schibsted Grotesk 400, 12px / 16px; `text-xs`): hints, limits, metadata.
- **Numbers** (JetBrains Mono 500, 12px / 16px; `font-mono`): canvas size, zoom percentage, hex values, coordinates.

### Named Rules

**The Measured in Mono Rule.** Every number the user reads or types as a measurement (W × H, zoom %, hex, opacity) is set in JetBrains Mono. Words stay in the grotesk; artwork titles and layer names are user content and stay in the UI face.

## Layout

- **Gallery.** Centered column, `max-w-6xl` (1152px), `px-4 py-10`, `gap-8` between header and grid. The header stacks on phones and becomes a row (title left, actions right) from `sm`; it ends in a `line` divider. The card grid is one column on phones, two from `sm` (640px), three from `lg` (1024px), four from `xl` (1280px), with `gap-6`.
- **Cards.** `p-4` with `gap-3` between a square thumbnail, the title row and the action row.
- **Modals.** An edge-to-edge bottom sheet on phones (top corners rounded, bottom safe-area inset), a centered card from `sm`. Widths `max-w-sm` / `max-w-md` / `max-w-lg`, all with `p-5` and `gap-4`; every size caps at 85dvh and scrolls without chaining to the page.
- **Side drawers.** Slide in from the right edge: 90% width on phones, half the viewport from `sm`, capped at 720px; full height with the bottom safe-area inset respected.
- **Hit targets.** Buttons are at least 40px tall (`min-h-10`), icon buttons 40 × 40, both 44px on coarse pointers (`pointer-coarse:`); step buttons 36 × 36. Swatches are 40px (comfortable) or 36px (compact).
- **Spacing.** The system uses Tailwind's 4px spacing scale directly; there are no named spacing tokens.

## Elevation & Depth

Depth is quiet and differs by theme, while the classes stay the same (The Tokens Only Rule).

- **Light (Paper & Ink).** Sheets of paper on a desk: cards carry one soft shadow (`shadow-sm`) plus a `line` border; overlays sit higher (modal `shadow-lg` / `shadow-xl`, side drawer `shadow-2xl`) over a `scrim` at 40–45%.
- **Dark (Studio Dark).** Shadows are not relied on; they barely register on graphite. Depth comes from stepping up the surface ramp: `bg` → `surface` → `surface-muted` → `surface-strong`, each step a little lighter, plus `line` / `line-strong` borders.

### Shadow Vocabulary

Tailwind's default shadows, unchanged per theme:

- **Resting** (`shadow-sm`): cards, outline buttons, inputs, button groups.
- **Floating** (`shadow-lg`): toasts, the editor's shift-direction pad.
- **Dialog** (`shadow-xl`): modals.
- **Drawer** (`shadow-2xl`): side drawers.

### Named Rules

**The Lighter Is Higher Rule.** In dark, a raised element is a lighter surface, never a darker one and never a glow.

## Shapes

Gently rounded, never pill-shaped and never sharp. Radius scale: **sm 4px**, **md 6px**, **lg 10px**, **xl 12px** (`--radius-*` in `@theme`).

- **xl (12px):** sheets: cards, modals, the gallery empty state.
- **lg (10px):** controls and inner wells: buttons, inputs, button groups, thumbnail wells, error banners.
- **md (6px):** swatches, step buttons.
- **sm (4px):** small inline targets such as the card title link focus area and the color picker input.

Borders are 1px (`line` for sheets and dividers, `line-strong` for controls). The empty state uses a dashed `line-strong` border. Thumbnails clip to their well.

## Components

Restrained and tactile: flat fills, 1px borders, color changes on hover, no motion beyond fades and the drawer slide.

### Buttons

- **Shape:** `rounded-lg` (10px), at least 40px tall, `px-3 py-2`, label in `text-sm font-medium`.
- **Primary:** `accent` fill, `on-accent` text, `accent-hover` on hover. One per view (The One Accent Rule).
- **Ghost:** transparent, `fg-soft` text, `surface-muted` fill on hover. The default for secondary actions (Rename, Clone, Cancel).
- **Outline:** `surface` fill, `control-border` border, `fg-soft` text, `shadow-sm`; `surface-subtle` on hover, `surface-muted` when pressed (Import JSON).
- **Danger:** `danger` fill, `on-danger` text, `danger-hover` on hover.
- **Step size:** 36 × 36 (`rounded-md`, `text-lg`), with ghost steps dimming to 40% when disabled.
- **Icon button** (`IconButton`): ghost, 40 × 40 (44 × 44 on coarse pointers), `rounded-lg`, 20px icon in `fg-soft`; its label is the accessible name and the tooltip, plus the shortcut when there is one ("Undo (Ctrl+Z)"). Toggles (pan, bucket, panels) set `pressed`: `surface-strong` fill, `fg` icon and an inset 1px `control-border` ring, with `aria-pressed`. A pressed state never uses the accent (The One Accent Rule).
- **Icons:** one family in `public/icons`: 24-grid, 1.5 stroke, `currentColor` outlines (tested), rendered through `PublicMaskIcon` at 20px in toolbars, drawer headers and menus. One meaning per glyph: Export downloads, Load image is a photo, Shift pixels is the four-way move arrow, Canvas size the outward corners. No text glyphs (`←`, `↑`) as icons.
- **Focus:** 2px outline, offset 2px, on `:focus-visible` only (`focus.style.ts`). Every variant uses the `focus` color; the outline never falls back to the browser's default ring.
- **Disabled:** 50% opacity, no pointer events.

### Cards

- **Corner Style:** `rounded-xl` (12px).
- **Background:** `surface` with a `line` border.
- **Shadow Strategy:** `shadow-sm` (see Elevation & Depth).
- **Artwork card:** `p-4`; a square thumbnail link on a `surface-muted` well (`rounded-lg`, image `object-cover`), a title link in `font-medium fg`, then a wrapping action row: Rename (ghost), Clone (ghost), Delete (danger, today).

### Modal

- `src/features/shared/components/Modal.tsx`: one skeleton for every dialog. Header: the title as a section heading (`text-base font-semibold fg`, wired to `aria-labelledby`) and a ghost X icon button; then the content; then an optional footer of right-aligned actions (Cancel ghost, primary last). Form dialogs pass `onSubmit`, so Enter in a field submits.
- Panel: `surface`, `line` border, `rounded-xl` (`rounded-t-xl` as a phone sheet), sized sm / md / lg (see Layout), `shadow-xl`.
- Overlay: `scrim` at 40% with a small backdrop blur by default (`dim="scrim"` drops the blur, `dim="none"` the scrim); clicking the backdrop dismisses, Escape covers the keyboard.
- Motion: overlay and panel fade in and out (the panel also rises 8px); opacity only under `prefers-reduced-motion`.

### Side Drawer

- Panel: `surface`, `line-strong` left border, `shadow-2xl`; slides in from the right (`translate-x`), or fades when `prefers-reduced-motion` is set.
- Backdrop: `scrim` at 45%, fading in and out.
- Header: `line` bottom border, heading `text-base font-semibold fg`, header icons 20px in `fg-soft`.

### Inputs / Fields

- **Style:** `surface` fill, `control-border` border, `rounded-lg`, `px-3 py-2 text-sm fg`, `shadow-sm`; placeholder in `subtle`.
- **Focus:** border turns `focus` with a 2px `focus` ring; no outline.
- **Field label:** `text-sm fg-secondary` stacked over the control with `gap-1`; hint in `text-xs subtle`.
- **Button group:** a `surface` shell with a `line-strong` border, `rounded-lg`, `p-0.5`, `shadow-sm`, holding adjacent buttons.

### Color Swatch

- 40 × 40 (comfortable) or 36 × 36 (compact), `rounded-md`, the swatch color itself as fill.
- **Rings:** idle 1px `control-border`; primary slot 2px `pick-primary`; secondary slot 2px `pick-secondary`; both slots 2px `accent`; selected (single-slot pickers) 2px `pick-primary` offset over `surface`. Rings offset by 2px over `bg` (the row's background) so the swatch color is never touched; the scroller pads 4px so the first ring is not clipped.
- **Roving keyboard position:** a 2px dashed `focus` outline, offset 2px, distinct from the selection ring.

### Theme Toggle

- `src/features/shared/components/ThemeToggle.tsx`: a segmented native radio group, **System / Light / Dark**. It sits in the gallery header and as a "Theme" row in the editor settings drawer. System clears the stored preference.

### Feedback

- **Error line** (gallery): `danger-surface` fill, `danger-fg` text, `rounded-lg`, `px-4 py-3 text-sm`.
- **Toasts:** a top-centered stack, each toast `rounded-lg`, 1px border, `px-4 py-3`, `shadow-lg`, message in `text-sm font-medium`. Tones: neutral (`surface`, `line`, `fg`), success (`success-surface`, `success-line`, `success-fg`), error (`danger-surface`, `danger-line`, `danger-fg-strong`).
- **Empty state** (gallery): dashed `line-strong` border, `rounded-xl`, `p-12`, centered `muted` text.

### Layers Drawer Rows

- Borderless drag handle (grip, `muted`), then the preview (the only bordered box), the name, and ghost `IconButton` actions (visibility, duplicate, rename).
- Idle row: `surface` with a `line` border, `surface-subtle` on hover. Active row: `surface-muted` with an `accent` border, the one place the accent marks a selection outside the swatch rings.

### Planned

Agreed follow-ups, not yet in the code:

- **Ghost Delete on cards.** Delete on artwork cards becomes a ghost action; the red `danger` fill appears only on the confirm button inside the delete dialog.
- **Mono numeric readouts.** Canvas size, zoom percentage and hex values move to JetBrains Mono (The Measured in Mono Rule).
- **Clean thumbnails.** Gallery thumbnails render without grid lines.
- **Type migration.** Labels and buttons move from `text-sm` (14/20) to the 13/16 label style; off-scale headings (`text-lg`) move onto the scale.

## Do's and Don'ts

### Do:

- **Do** style only through semantic token utilities (`bg-surface`, `text-muted`, `ring-pick-primary`); one class works in both themes.
- **Do** keep one `accent` element per view: the primary button.
- **Do** use ghost or outline buttons for everything that is not the primary action.
- **Do** set numbers the user measures in JetBrains Mono.
- **Do** express depth in dark with the surface ramp (`bg` → `surface` → `surface-muted` → `surface-strong`).
- **Do** check every new token pair against both themes in `src/app/tokenContrast.test.ts`.
- **Do** keep focus visible on `:focus-visible` with the 2px offset outline.

### Don't:

- **Don't** tint a surface or the page with a hue (the blue-gray `#cfd9df` page this system replaces did).
- **Don't** add a second accent, colored glows, neon or gradients.
- **Don't** use pure black (`#000`) as a surface; it is only the dark `scrim`, under transparency.
- **Don't** branch on theme in components or renderers (`dark:` variants, theme conditionals, hex literals).
- **Don't** put texture, pattern or color behind the artwork; the checkerboard is the only thing under the canvas.
- **Don't** use `pick-secondary` as a button or text color, or use the accent as body text.
- **Don't** change font size, weight or spacing between themes.
- **Don't** fill a destructive button red outside a confirmation step once the ghost Delete lands.
