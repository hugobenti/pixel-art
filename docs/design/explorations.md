# Theme exploration (October 2026)

Record of how PixelCraft's light and dark themes were chosen. The resulting system is specified in [`DESIGN.md`](../../DESIGN.md); this file keeps the reasoning and the directions that were not taken.

## Why

The theme before this exploration worked against the product's first principle, "the artwork is the hero; chrome recedes and stays color-neutral" (`PRODUCT.md`):

- **Tinted page.** The page background was a blue-gray `#cfd9df`. Every palette color was judged against a cool tint, which shifts how warm and cool colors read.
- **Generic neutrals.** Surfaces, lines and text were Tailwind's zinc grays, with no character of their own and no relation to the tinted page.
- **Wrong typeface.** `next/font` loaded Geist, but an unlayered `body { font-family: Arial, Helvetica, sans-serif; }` rule in `globals.css` beat the `font-sans` utility, so the app rendered in Arial.
- **Loud destructive action.** Every gallery card carried a solid red Delete button, making the most dangerous action the most saturated element after the artwork.
- **Grid lines in thumbnails.** Gallery thumbnails showed faint grid lines between pixels, chrome drawn into the artwork itself.
- **No dark theme**, for users who draw for an evening.

## Method

1. **Four deliberately divergent directions**, each placed on four axes so that together they cover the space rather than cluster:
   - light ↔ dark
   - warm ↔ cool
   - restrained ↔ loud
   - type voice (grotesk, humanist, bitmap display, technical grotesk + mono)
2. **Demos in the real app, not mockups.** Each direction is a drop-in `tokens.css` (the `@theme` color block, fonts, radii). The demos were rendered by injecting each token set into the running app and capturing the editor, gallery, new-artwork modal and layers drawer at 1440px and 390px wide, next to the same screens in the current theme.
3. **Same contrast contract.** Every direction was checked against the 36 token pairs of `src/app/tokenContrast.test.ts` (text pairs at 4.5:1, UI pairs at 3:1). All four directions pass all 36.

"Tightest pair" below is the pair with the least headroom over its threshold (ratio ÷ required).

## Studio Dark ("Darkroom")

- **Position:** dark · warm graphite · restrained · grotesk + mono.
- **Intent:** a night-studio workspace. The chrome drops back to warm graphite so the artwork is the brightest thing on screen; amber is the only warm signal and marks the one thing you can act on.
- **Suits:** long sessions; game developers coming from Aseprite, Godot or Unity dark UIs.
- **Trade-off:** dark chrome makes mid-tones look brighter than they will on a light page or in an exported PNG, and light-background sprites glare. Weakest on a phone in daylight.
- **Type:** Schibsted Grotesk (UI) + JetBrains Mono (numbers). Page title 600 24/32 · section heading 600 16/24 · body 400 14/20 · label/button 500 13/16 · caption 400 12/16 · numbers JetBrains Mono 500 12/16.
- **Shape:** radius 4 / 6 / 10, 1px lines. No drop shadows on dark: elevation is a step up in surface (`bg` → `surface` → `surface-muted` → `surface-strong`).
- **Component treatment:**
  - Primary button: amber fill, near-black text. One per view.
  - Secondary: transparent with a `line-strong` border; hover fills `surface-muted`.
  - Swatch selection: 2px amber ring = primary slot, 2px blue ring = secondary slot.
  - Toolbar: icons in `muted`, `fg` on hover; the active tool sits on a `surface-strong` pill.
  - Delete on cards becomes a ghost action; red fill only inside the confirm dialog.
- **Do:** keep the accent to one element per view; use mono for every number the user reads or types.
- **Don't:** colored glows or neon; pure black (`#000`) surfaces.
- **Key hexes:** bg `#141312` · surface `#1c1b19` · fg `#efebe5` · accent `#eda743` · focus `#f5bb64`.
- **Contrast:** 36/36 pass. Tightest pair `subtle` / `surface-subtle` 4.95:1 (needs 4.5). Lowest absolute ratio `guide-horizontal` / `checker-light` 3.86:1 (needs 3).

## Paper & Ink ("Sketchbook")

- **Position:** light · warm paper · crafted · humanist + display weight.
- **Intent:** a sketchbook on a desk: warm off-white paper, ink-dark text and a single ultramarine ink accent. It reads as a craft tool rather than software and is the most welcoming of the four.
- **Suits:** hobbyists and first-timers; a gallery that feels like a portfolio.
- **Trade-off:** the warm white tilts perception a little: cool blues in a sprite look cooler next to it. Least "game tool" of the four, and the humanist face is less crisp in a dense toolbar.
- **Type:** Alegreya Sans (UI) + Fragment Mono (numbers). Page title 800 32/36 · section heading 700 20/28 · body 400 17/26 · label/button 500 15/20 · caption 400 14/20 · numbers Fragment Mono 400 13/20. The face runs small on the em, hence the larger sizes.
- **Shape:** radius 3 / 6 / 10: pencil-sharp controls, softer sheets (cards, modal, drawers). Warm hairlines, one soft 1px paper shadow on cards.
- **Component treatment:**
  - Primary button: ultramarine fill, paper text.
  - Secondary: paper surface with a `line-strong` border.
  - Swatch selection: ultramarine ring = primary, burnt-orange ring = secondary.
  - Optional graph-paper texture in the gallery header and empty state only, never on the canvas.
  - Delete in oxblood, ghost on cards, filled only in the confirm dialog.
- **Do:** let the gallery title use the 800 weight as the one display moment; keep body at 17px (the face runs small).
- **Don't:** texture behind the artwork; mixing in a second accent color.
- **Key hexes:** bg `#ece9e1` · surface `#fcfbf7` · fg `#1a1c24` · accent `#2b3a9e` · focus `#2b3a9e`.
- **Contrast:** 36/36 pass. Tightest pair `subtle` / `surface-subtle` 5.19:1 (needs 4.5). Lowest absolute ratio `guide-horizontal` / `checker-dark` 3.85:1 (needs 3).

## Retro Handheld ("Cartridge")

- **Position:** light · console-shell gray · loud · bitmap display + readable sans.
- **Intent:** pixel-native: console-shell grays, a berry accent borrowed from A/B buttons, navy focus. Headings and buttons speak in a pixel face; body copy stays in a highly legible sans. Square corners, 2px ink borders, keycap shadows that collapse when pressed.
- **Suits:** a strong, ownable identity; pairs well with a rename. Celebrates the medium.
- **Trade-off:** most work beyond tokens: 2px borders and pressed states are style-file changes (the demo shows tokens, fonts and shadows only). The pixel face is locked to a few sizes and has limited glyph coverage, and loud chrome can compete with the art. Risk of kitsch if pushed further.
- **Type:** Pixelify Sans (display, labels, numbers) + Atkinson Hyperlegible Next (body). Page title Pixelify 600 32/40 · section heading Pixelify 500 24/32 · body Atkinson 400 15/22 · label/button Pixelify 500 16/20 · caption Atkinson 400 13/18 · numbers Pixelify 400 16/20.
- **Shape:** radius 0 everywhere. 2px ink borders (`line-strong`) on controls and sheets. Keycap shadow `0 2px 0` ink, dropping to 0 on `:active`.
- **Component treatment:**
  - Primary button: berry fill, white text, 2px ink border, keycap shadow.
  - Secondary: shell surface, 2px ink border, same keycap press.
  - Swatch selection: navy-blue ring = primary, orange ring = secondary, square.
  - Pixel face only at 16 / 24 / 32px so its grid lands on whole pixels.
  - User content (artwork titles, layer names) always in the readable sans.
- **Do:** keep surfaces gray so palette colors read true; use the pressed-key motion as the one bit of personality.
- **Don't:** pixel face for paragraphs or below 16px; CRT scanlines, glow or 8-bit sound gimmicks.
- **Key hexes:** bg `#d7d6d1` · surface `#f4f3ef` · fg `#1a1a18` · accent `#8e1d4c` · focus `#24359a`.
- **Contrast:** 36/36 pass. Tightest pair `subtle` / `surface-subtle` 5.53:1 (needs 4.5). Lowest absolute ratio `guide-horizontal` / `checker-dark` 3.76:1 (needs 3).

## Precision Tool ("Instrument")

- **Position:** light · cool neutral · dense/technical · grotesk + mono.
- **Intent:** a compact instrument: cool neutral grays, hairline borders, tight spacing and a safety-orange signal. Numbers, sizes and coordinates are set in a monospace face, as they would be on a measuring tool.
- **Suits:** indie developers producing assets to exact sizes; people who live in Figma or Linear.
- **Trade-off:** the orange passes only as a fill (3.07:1 against the page), never as text. The cool gray is the most neutral surface of the four (best color fidelity), but the look can turn clinical, and the density needs care on touch.
- **Type:** Archivo (UI, width 92) + Martian Mono (numbers, width 87.5). Page title 600 20/28 · section heading 600 14/20 · body 400 14/20 · label/button 500 13/16 · caption 400 12/16 · numbers Martian Mono 400 12/16.
- **Shape:** radius 2 / 4 / 6. Hairline borders, almost no shadow (modal only). 32px controls on desktop, 44px on touch.
- **Component treatment:**
  - Primary button: orange fill with ink text (never orange text on gray).
  - Focus ring is ink, not orange, so focus and selection never look alike.
  - Swatch selection: orange ring = primary, blue ring = secondary.
  - Field labels and readouts (W × H, zoom %, hex) in Martian Mono.
  - Toolbar grouped by hairline dividers instead of spacing alone.
- **Do:** use orange only as a fill or a ring; align numbers on tabular figures.
- **Don't:** orange text; shrinking touch targets on phones to keep the density.
- **Key hexes:** bg `#e8eaed` · surface `#fbfbfc` · fg `#111317` · accent `#e5560a` · focus `#111317`.
- **Contrast:** 36/36 pass. Tightest pair `accent` / `bg` 3.07:1 (needs 3), also the lowest absolute ratio.

## Decision

- **Light theme = Paper & Ink colors. Dark theme = Studio Dark colors.** The two share a warm, low-chroma temperament and a single-accent discipline, so they read as one studio under two lighting conditions ("The Sketchbook and the Darkroom" in `DESIGN.md`). Paper & Ink's weakness (least "game tool", humanist face soft in a toolbar) and Studio Dark's (mid-tones read brighter, weak in daylight) cover for each other once the user can switch.
- **One type system for both: Schibsted Grotesk + JetBrains Mono**, on Studio Dark's scale (24/32, 16/24, 14/20, 13/16, 12/16; numbers 12/16 mono). Paper & Ink's Alegreya Sans and Fragment Mono were dropped: a theme switch changes color only, never font metrics, so there is no layout shift. This also retires Paper & Ink's 17px body rule, which existed only because Alegreya runs small.
- **One radius scale:** sm 4px / md 6px / lg 10px (Paper & Ink's 3px small radius rounds up to Studio Dark's 4px).
- **Default follows the OS** (`prefers-color-scheme`). A System / Light / Dark toggle overrides it and is stored in `localStorage` under `pixelcraft-theme` (`"light"` or `"dark"`; absent means system).
- **Agreed follow-ups** carried from both directions: Delete on cards becomes a ghost action with the red fill only in the confirm dialog; numeric readouts move to the mono face; thumbnails render without grid lines.

Not chosen:

- **Retro Handheld:** the most work beyond tokens (2px borders, pressed states, a size-locked pixel face with limited glyphs), and its loud chrome competes with the art.
- **Precision Tool:** its orange accent passes only as a fill, never as text, and the dense, cool look risks feeling clinical and needs care on touch.
