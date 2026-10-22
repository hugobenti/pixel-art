/**
 * Purpose:
 * Markup for generated brand images (icons, social image) rendered by `next/og`: solid blocks on an
 * optional background, plus an optional centered caption.
 *
 * Notes:
 * `next/og` reads inline styles only (no classes, no CSS variables), and every container needs
 * `display: flex`.
 */

import type { IBrandImageProps } from "./BrandImage.type";

export function BrandImage({ width, height, background, blocks, caption }: IBrandImageProps) {
  return (
    <div style={{ display: "flex", position: "relative", width, height, background }}>
      {blocks.map((block, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: block.left,
            top: block.top,
            width: block.width,
            height: block.height,
            background: block.color,
          }}
        />
      ))}
      {caption ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: caption.top,
            width,
            display: "flex",
            justifyContent: "center",
            fontFamily: caption.fontFamily,
            fontSize: caption.fontSize,
            fontWeight: 600,
            color: caption.color,
          }}
        >
          {caption.text}
        </div>
      ) : null}
    </div>
  );
}
