/**
 * Purpose:
 * Bordered surface for lists and summaries (gallery cards, settings panels).
 */
"use client";
import type { ICardProps } from "./Card.type";

const cardBaseClass =
  "rounded-xl border border-line bg-surface shadow-sm";

export function Card({ children, className = "", ...rest }: ICardProps) {
  const classes = `${cardBaseClass} ${className}`.trim();
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}
