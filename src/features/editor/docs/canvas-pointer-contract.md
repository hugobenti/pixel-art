# Canvas pointer contract

This document describes how touch and pointer gestures interact in the pixel editor. It exists to keep behavior consistent across mobile and desktop when changing hooks or DOM handlers.

## Single registry

- **`useEditorPointerContacts`** owns one `Set<number>` of active **touch** pointer IDs (`pointerType === "touch"`).
- The Set is updated on `window` in **capture** phase (`pointerdown` adds, `pointerup` / `pointercancel` removes).
- **Do not** duplicate touch counting inside `useViewportNavigation`, `usePixelPainting`, or elsewhere.

## Hook registration order

In `EditorWorkspace`, call **`useEditorPointerContacts` first**, then `useViewportNavigation`, then `usePixelPainting`. Later hooks that attach capture listeners on `pointerdown` run after the registry has been updated for that event.

## Drawing

- **Desktop:** One mouse button drives painting; multi-touch rules do not apply.
- **Touch:** Painting may proceed only while **exactly one** touch contact exists. A second finger anywhere on the screen ends the current stroke immediately (capture listener in `usePixelPainting` after the registry update).
- Internal stroke state uses `painting` / `activePaintingPointerId`; conceptually this is “draw permission” tied to the active pointer.

## Color picker

- **`useColorPickerHold`** takes a canvas press before painting does: the workspace calls its `onPickPointerDown` first and passes the press to `usePixelPainting` only when it returns false.
- A press starts a pick hold when the picker is armed or Alt is held (`shouldStartPickHold`). Pan still wins: with Space held or pan mode on, the main button pans. Touch needs exactly one contact.
- While holding, nothing changes; release over a color fills the slot (the right button fills the other slot). Release over an empty spot or off the canvas, Escape, `pointercancel`, a second touch and window blur all end the hold without picking.
- Register it after `useEditorPointerContacts`, like painting, so its second-touch capture listener sees the updated touch Set.

## Pan (drag viewport)

- Touch pan follows the same single-contact rule: pan updates apply only while `touchPointersRef.size === 1`.
- If a second touch lands, active pan is cancelled.

## Zoom

- **Wheel** and **two-finger pinch** update the viewport independently of paint/pan mode.
- Pinch is implemented in `attachViewportPinchZoom` with its own two-pointer `Map` so both contacts stay tracked even when one pointer has capture on the canvas.

## Debugging checklist (mobile)

1. Second finger down ends paint stroke and does not leave painting stuck on.
2. Pinch scales toward the midpoint between the two touches.
3. Pan mode: one finger pans; two fingers zoom without drawing pixels.
