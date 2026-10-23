# Color picker implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** an eyedropper tool in the editor: arm it (toolbar button or hold `Alt`), press and drag on the canvas with a round split-ring loupe, release to put that palette color in the paint slot.

**Architecture:** pure, DOM-free rules in `features/editor/logic` (pick target, loupe cells and placement, tool switching, row scrolling), one hook `useColorPickerHold` that owns the pointer hold and `Alt` state, and one presentation component `ColorPickerOverlay` rendered `fixed` at the `EditorWorkspace` level. Painting stays untouched: the workspace runs the picker's pointer-down first and only falls through to painting when the picker did not take the press.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind, Vitest (node environment, no DOM library).

**Spec:** `docs/design/color-picker.md`.

## Global Constraints

- `AGENTS.md`: `.tsx` presentation only; hooks `useX.ts`; classes `X.style.ts` with `cx()`; types `X.type.ts` (`I`/`T` prefixes); copy in `src/content`. No arithmetic or template literals in `.tsx`.
- Editor must not import gallery; `shared` must not import editor.
- Icons: `public/icons/*.svg`, `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="1.5"`, registered in `PUBLIC_ICONS` (`publicIcons.test.ts`).
- Copy: toolbar label "Color picker", shortcut "hold Alt"; off-canvas pill "Release to cancel".
- Loupe: 5 × 5 cells, 18px cells, 12px ring split horizontally (top = picked, bottom = paint-slot color), black and white edges, checkerboard for empty cells.
- A pick never changes pixels and never pushes history.
- Checks before each commit: `npm run lint`, `npm run typecheck`, `npm test`.

## Review Focus

1. **Release off the canvas after dragging over colors:** must change nothing, and the palette row marker must return to the swatch it had before the hold. Task 4 smoke step 3.
2. **A second finger landing mid-hold on a phone:** the hold cancels like an off-canvas release; it must not pick and must not start painting. Task 4 smoke step 5.
3. **Pointer near the top/right of the window:** the loupe flips so it stays fully visible. Task 1 `loupePlacement` tests.
4. **Picking on a pixel whose top layer is hidden or transparent:** picks the color you see below. Task 1 `pickTargetAt` tests.
5. **Disarming after picking from bucket mode:** bucket comes back on; from pan mode, brush. Task 2 tests.

---

### Task 1: Pick rules (pure logic)

**Files:**
- Create: `src/features/editor/logic/colorPicker.ts`, `colorPicker.type.ts`, `colorPicker.test.ts`

**Interfaces:**
- Consumes: `compositeOpaquePaletteIndexAt` (`logic/visibleCompositePixelCounts.ts`), `screenToWorldCoordinates` (`logic/coordinateMath.ts`), `IViewportState`, `TColorSlot`.
- Produces:
  - `type TPickTarget = { kind: "color"; x: number; y: number; paletteIndex: number } | { kind: "empty"; x: number; y: number; inArtwork: boolean } | { kind: "offCanvas" }`
  - `pickTargetAt(artwork: Pick<IArtwork,"width"|"height"|"layers"|"palette">, viewport: IViewportState, canvasPoint: { x: number; y: number } | null): TPickTarget` — `canvasPoint` is in canvas CSS pixels, `null` when the pointer is outside the canvas rect.
  - `loupeCells(artwork: Pick<IArtwork,"width"|"height"|"layers"|"palette">, x: number, y: number): (string | null)[]` — 25 entries, row-major from `(x-2, y-2)`, palette hex or `null` (empty).
  - `pickSlotForButton(button: number, activeSlot: TColorSlot): TColorSlot` — `2` → other slot.
  - `shouldStartPickHold(input: { armed: boolean; altKey: boolean; button: number; pointerType: string; touchCount: number; panDeferred: boolean }): boolean`
  - `loupePlacement(input: { pointerX: number; pointerY: number; size: number; gap: number; viewportWidth: number; viewportHeight: number }): { left: number; top: number }`
  - Constants: `LOUPE_RADIUS_CELLS = 2`, `LOUPE_CELL_PX = 18`, `LOUPE_RING_PX = 12`, `LOUPE_GAP_MOUSE_PX = 16`, `LOUPE_GAP_TOUCH_PX = 48`.

- [ ] **Step 1: Write failing tests** in `colorPicker.test.ts` (artwork 4 × 4, palette `["#000000","#FFFFFF","#FF0000"]`, top layer index 0, bottom layer index 1; top layer pixels `255` at `(0,0)`, `2` at `(1,0)`; bottom layer all `1`; viewport `{ scale: 10, viewOffset: { x: 0, y: 0 } }`):
  - `pickTargetAt(..., null)` → `{ kind: "offCanvas" }`.
  - `pickTargetAt(..., { x: 15, y: 5 })` → `{ kind: "color", x: 1, y: 0, paletteIndex: 2 }`.
  - `(5, 5)` (top transparent) → `{ kind: "color", x: 0, y: 0, paletteIndex: 1 }` (sees through to bottom).
  - bottom layer `visible: false` and `(5, 5)` → `{ kind: "empty", x: 0, y: 0, inArtwork: true }`.
  - `(45, 5)` → `{ kind: "empty", x: 4, y: 0, inArtwork: false }`.
  - `loupeCells(art, 0, 0)` has length 25; index 12 is the center `(0,0)`; index 0 (`(-2,-2)`) is `null`; index 13 (`(1,0)`) is `"#FF0000"`.
  - `pickSlotForButton(0, "primary")` → `"primary"`; `pickSlotForButton(2, "primary")` → `"secondary"`; `pickSlotForButton(2, "secondary")` → `"primary"`.
  - `shouldStartPickHold`: armed + button 0 → true; not armed + `altKey` → true; not armed, no alt → false; `panDeferred` + button 0 → false; button 1 → false; touch with `touchCount: 2` → false; armed + button 2 → true.
  - `loupePlacement({ pointerX: 500, pointerY: 500, size: 114, gap: 16, viewportWidth: 1440, viewportHeight: 900 })` → `{ left: 516, top: 370 }` (right of pointer, above it: `top = pointerY - gap - size`).
  - Near the right edge (`pointerX: 1400`) → `left = 1400 - 16 - 114 = 1270`. Near the top (`pointerY: 50`) → `top = 50 + 16 = 66`.
- [ ] **Step 2:** `npx vitest run src/features/editor/logic/colorPicker.test.ts` → FAIL (module missing).
- [ ] **Step 3:** implement. `pickTargetAt` maps with `screenToWorldCoordinates`, then `compositeOpaquePaletteIndexAt`; `inArtwork` is the bounds check. `loupePlacement` prefers right/above and flips each axis independently when it would leave `[0, viewport]`.
- [ ] **Step 4:** run the test → PASS.
- [ ] **Step 5:** commit `feat(editor): color picker pick rules`.

### Task 2: Tool switching (pure logic)

**Files:**
- Create: `src/features/editor/logic/editorTools.ts`, `editorTools.type.ts`, `editorTools.test.ts`
- Modify: `src/features/editor/components/useEditorWorkspace.ts:201-219` (toggles use it)

**Interfaces:**
- Produces:
  - `interface IEditorToolState { panMode: boolean; bucketMode: boolean; pickerArmed: boolean; pickerReturnsToBucket: boolean }`
  - `type TEditorToolAction = "togglePan" | "toggleBucket" | "togglePicker" | "pickApplied"`
  - `applyToolAction(state: IEditorToolState, action: TEditorToolAction): IEditorToolState`

- [ ] **Step 1: Write failing tests:**
  - `togglePicker` from brush → `{ pickerArmed: true, panMode: false, bucketMode: false, pickerReturnsToBucket: false }`.
  - `togglePicker` from bucket → bucket off, `pickerReturnsToBucket: true`; then `togglePicker` again → `{ pickerArmed: false, bucketMode: true }`.
  - `togglePicker` from pan → pan off; then `pickApplied` → `{ pickerArmed: false, panMode: false, bucketMode: false }`.
  - `pickApplied` from armed-from-bucket → bucket on, picker off.
  - `pickApplied` when not armed (quick pick) → state unchanged.
  - `togglePan` while armed → picker off, pan on, bucket stays off (no restore). `toggleBucket` while armed → picker off, bucket on.
  - Existing rules kept: `togglePan` turns bucket off; `toggleBucket` turns pan off.
- [ ] **Step 2:** run → FAIL.
- [ ] **Step 3:** implement; in `useEditorWorkspace` add `const [pickerArmed, setPickerArmed] = useState(false)` and `pickerReturnsToBucket` state, and one `runToolAction(action)` that computes `applyToolAction` from current values and sets `setPanMode`, `setBucketMode`, `setPickerArmed`, `setPickerReturnsToBucket`. `togglePanMode` / `toggleBucketMode` / new `togglePicker` call it. Escape-to-disarm reuses `togglePicker` (Task 4).
- [ ] **Step 4:** run → PASS; `npm run typecheck`.
- [ ] **Step 5:** commit `feat(editor): picker joins pan and bucket tool switching`.

### Task 3: Palette row follows the pick

**Files:**
- Create: `src/features/editor/logic/scrollReveal.ts`, `scrollReveal.test.ts`
- Modify: `src/features/editor/hooks/useEditorPalette.ts:55-65` (slot setter), `src/features/editor/components/useColorSelectionRow.ts`, `ColorSelectionRow.tsx` (refs), `ColorSelectionRow.type.ts` if needed

**Interfaces:**
- Produces:
  - `scrollLeftToReveal(input: { itemStart: number; itemEnd: number; scrollLeft: number; viewWidth: number; padding: number }): number | null` — new `scrollLeft`, or `null` when already fully visible.
  - `useEditorPalette` returns `assignSwatchToSlot(slot: TColorSlot, index: number): void` (sets focus and that slot); `assignSwatchToActiveSlot(index)` calls it with `activeSlot`.
  - `useColorSelectionRow` returns `scrollerRef` and `swatchRefs` (or a list ref) and scrolls the focused swatch into view whenever `focusedIndex` changes, using `scrollLeftToReveal` (not `scrollIntoView`, which can scroll the page).

- [ ] **Step 1: Write failing tests:** fully visible → `null`; item right of view (`itemStart: 500, itemEnd: 540, scrollLeft: 0, viewWidth: 300, padding: 4`) → `244`; item left of view (`itemStart: 40, itemEnd: 80, scrollLeft: 200, viewWidth: 300, padding: 4`) → `36`.
- [ ] **Step 2:** run → FAIL.
- [ ] **Step 3:** implement the function, the slot setter and the row scrolling.
- [ ] **Step 4:** run → PASS; typecheck; lint.
- [ ] **Step 5:** commit `feat(editor): palette row reveals the focused swatch`.

### Task 4: Pick hold, loupe and toolbar button

**Files:**
- Create: `src/features/editor/hooks/useColorPickerHold.ts`, `useColorPickerHold.type.ts`
- Create: `src/features/editor/components/ColorPickerOverlay.tsx`, `.style.ts`, `.type.ts`, `useColorPickerOverlay.ts`
- Create: `public/icons/pipette.svg`; Modify: `src/features/shared/constants/publicIcons.ts`
- Modify: `useEditorWorkspace.ts`, `EditorWorkspace.tsx`, `EditorActionsBar.tsx`, `EditorActionsBar.type.ts`, `src/content/editor.ts`, `src/content/content.type.ts`

**Interfaces:**
- Consumes: Task 1 functions and constants, Task 2 `togglePicker` / `runToolAction("pickApplied")`, Task 3 `assignSwatchToSlot`.
- Produces:
  - `useColorPickerHold(params: { artwork; viewport; canvasRef; touchPointersRef; deferPrimaryPaint: () => boolean; armed: boolean; activeSlot: TColorSlot; primaryIndex: number; secondaryIndex: number; onPick: (slot: TColorSlot, index: number) => void; onDisarm: () => void })` returns `{ onPickPointerDown(e: React.PointerEvent<HTMLCanvasElement>): boolean; hold: IPickHold | null; altHeld: boolean }`.
  - `interface IPickHold { target: TPickTarget; clientX: number; clientY: number; pointerType: string; slot: TColorSlot; canvasRect: { left: number; top: number } }`.
  - `ColorPickerOverlay` props: `{ hold: IPickHold | null; artwork; viewport; palette: string[]; slotColor: string }`.
  - Content: `editor.toolbar.picker: IIconControl = { label: "Color picker", shortcut: "hold Alt" }`, `editor.picker.releaseToCancel = "Release to cancel"`.

- [ ] **Step 1: Hook.** `onPickPointerDown` returns `false` unless `shouldStartPickHold` (with `altKey: e.altKey`, `panDeferred: deferPrimaryPaint()`, `touchCount: touchPointersRef.current.size`). When it starts: `preventDefault`, `setPointerCapture` on the canvas, store slot `pickSlotForButton(e.button, activeSlot)`, compute the first target. Window listeners while holding: `pointermove` (same pointer id) updates target from the canvas rect (`null` point when outside the rect); `pointerup` resolves: `color` → `onPick(slot, paletteIndex)`; else nothing; `pointercancel`, `blur`, `Escape` keydown, and a second touch (`pointerdown` capture with `touchPointersRef.current.size > 1`) cancel. Recompute target when `viewport` changes mid-hold. `Escape` while armed and not holding → `onDisarm()` (skip when `e.defaultPrevented` or text entry). `altHeld`: keydown/keyup on `"Alt"`, cleared on `blur`; when an `Alt` quick pick happened, `preventDefault` the `Alt` keyup (Firefox menu bar).
- [ ] **Step 2: Workspace wiring.** `onArtworkPointerDown = (e) => { if (!picker.onPickPointerDown(e)) painting.onArtworkPointerDown(e); }`. `onPick(slot, index)` → `paletteUi.assignSwatchToSlot(slot, index)` then `runToolAction("pickApplied")`. Row marker: pass `focusedSwatchIndex = hold?.target.kind === "color" ? hold.target.paletteIndex : paletteUi.focusedSwatchIndex`. Toolbar `pickerPressed = pickerArmed || altHeld`.
- [ ] **Step 3: Overlay.** `fixed inset-0 pointer-events-none z-50` layer, `aria-hidden`. `useColorPickerOverlay` computes: pixel outline rect in client coords (`canvasRect + viewOffset + scale * x`, size `scale`) when `inArtwork`; loupe `{left, top}` from `loupePlacement` with size `5*18 + 2*12 = 114` and gap by `pointerType`; 25 cell styles (hex or checker class); ring halves (top = picked hex or checker, bottom = `slotColor`); the pill position when `offCanvas`. Classes in `.style.ts`: outline `shadow-[0_0_0_2px_#fff,0_0_0_4px_#000]`, loupe `rounded-full shadow-lg`, checker via `--color-checker-light` / `--color-checker-dark`, pill `rounded-full border border-line-strong bg-surface px-2.5 py-1 text-xs text-fg shadow-lg`.
- [ ] **Step 4: Toolbar + icon + content.** `pipette.svg` (Lucide pipette paths, `stroke-width="1.5"`), `PUBLIC_ICONS.pipette`; `IconButton` after bucket with `pressed={pickerPressed}`, `label`/`shortcut` from `toolbar.picker`, `onClick={onTogglePicker}`.
- [ ] **Step 5: Verify:** `npm run lint`, `npm run typecheck`, `npm test` pass. Browser smoke at 1440 × 900 and 390 × 844 (touch emulation):
  1. Arm, press on a color, drag over three colors: loupe follows with split ring; the row marker moves and scrolls; release → slot takes the color, picker unpressed.
  2. Press over the checkerboard outside the artwork: ring top checkerboard; release → nothing changes, picker stays pressed.
  3. Drag off the canvas onto the palette row and release: loupe hidden, pill shown; nothing changes; row marker back where it was.
  4. Hold `Alt`, press-drag-release on a color without arming: slot changes; brush still active; toolbar button pressed only while `Alt` is down.
  5. Touch: second finger mid-hold → hold ends, nothing picked, no pixels painted.
  6. Arm from bucket, pick → bucket is active again.
- [ ] **Step 6:** commit `feat(editor): color picker tool with loupe`.

### Task 5: Help, shortcut display and docs

**Files:**
- Modify: `src/content/help.ts`, `src/content/content.type.ts` (`effect` union adds `"altPick"`, `keyNames.alt`), `src/content/help.test.ts`, `src/features/site/logic/keyCombo.ts` + `keyCombo.type.ts` + `keyCombo.test.ts`
- Modify: `README.md`, `DESIGN.md`, `PRODUCT.md`, `src/features/editor/docs/canvas-pointer-contract.md`

- [ ] **Step 1: Failing tests:** `help.test.ts` effect list includes `"altPick"`, and its case asserts `shouldStartPickHold({ armed: false, altKey: true, button: 0, pointerType: "mouse", touchCount: 0, panDeferred: false })` is `true`; `keyCombo.test.ts`: `{ key: "Alt" }` formats as `"⌥"` on apple and `"Alt"` elsewhere.
- [ ] **Step 2:** run → FAIL.
- [ ] **Step 3:** help shortcut row `{ action: "Pick a color from the canvas", combo: { key: "Alt" }, effect: "altPick", note: "hold, then press and drag on the canvas" }`; `keyNames.alt: "Alt"`; `formatKeyCombo` maps `"Alt"` to `⌥` on apple. Help section "Picking a color": "Turn on the color picker in the toolbar (or hold Alt), press on the canvas and drag. The loupe shows the color under your finger or pointer on top and your current color below. Let go to use it. Letting go on an empty spot or outside the canvas changes nothing."
- [ ] **Step 4:** docs: README features + shortcut table; DESIGN.md IconButton toggles (pan, bucket, picker), icon meaning for pipette, loupe in the Floating elevation list and a short "Color picker loupe" component note, palette row marker during a hold; PRODUCT.md tools list; pointer contract "Color picker" section (pick hold takes the press before painting; one touch only; second touch cancels).
- [ ] **Step 5:** `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` pass; commit `docs(editor): color picker help and docs`.
