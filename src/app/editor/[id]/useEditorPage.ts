/**
 * Purpose:
 * Editor route params: the artwork id from the URL, or "" when the segment is not a single string.
 */
"use client";

import { useParams } from "next/navigation";

export function useEditorPage() {
  const params = useParams();
  return { id: typeof params.id === "string" ? params.id : "" };
}
