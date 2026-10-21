/**
 * Purpose:
 * Bordered surface for lists and summaries (gallery cards, settings panels).
 */
"use client";

import type { HTMLAttributes, ReactNode } from "react";

import { card } from "@/features/shared/components/Card.style";
import { cx } from "@/features/shared/utils/cx";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, className, ...rest }: CardProps) {
  return (
    <div className={cx(card.base, className)} {...rest}>
      {children}
    </div>
  );
}
