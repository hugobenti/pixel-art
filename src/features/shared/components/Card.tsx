/**
 * Purpose:
 * Bordered surface for lists and summaries (gallery cards, settings panels).
 */
"use client";

import type { HTMLAttributes, ReactNode } from "react";

const cardBaseClass =
  "rounded-xl border border-zinc-200 bg-white shadow-sm";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, className = "", ...rest }: CardProps) {
  const classes = `${cardBaseClass} ${className}`.trim();
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}
