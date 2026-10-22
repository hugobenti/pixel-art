/**
 * Purpose:
 * Bordered surface for lists and summaries (gallery cards, settings panels).
 */
"use client";
import { cx } from "@/features/shared/utils/cx";
import { card } from "./Card.style";
import type { ICardProps } from "./Card.type";

export function Card({ children, className, ...rest }: ICardProps) {
  return (
    <div className={cx(card.base, className)} {...rest}>
      {children}
    </div>
  );
}
