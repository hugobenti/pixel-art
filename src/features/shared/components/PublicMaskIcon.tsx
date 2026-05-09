/**
 * Purpose:
 * Renders a /public SVG using CSS mask so the glyph follows the current text color (inherit/cascade).
 *
 * Notes:
 * SVG files should use opaque strokes/fills (e.g. black) so masking picks up shape reliably.
 */
"use client";

const maskLayoutClass =
  "pointer-events-none inline-block shrink-0 bg-current [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center]";

interface PublicMaskIconProps {
  src: string;
  className?: string;
}

export function PublicMaskIcon({
  src,
  className = "h-5 w-5",
}: PublicMaskIconProps) {
  const maskUrl = `url("${src}")`;
  return (
    <span
      aria-hidden
      className={`${maskLayoutClass} ${className}`.trim()}
      style={{
        maskImage: maskUrl,
        WebkitMaskImage: maskUrl,
      }}
    />
  );
}
