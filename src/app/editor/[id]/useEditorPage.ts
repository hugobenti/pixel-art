/**
 * Purpose:
 * Reads the artwork id from the dynamic editor route params ("" when missing).
 */
"use client";

import { useParams } from "next/navigation";

export function useEditorPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  return { id };
}
