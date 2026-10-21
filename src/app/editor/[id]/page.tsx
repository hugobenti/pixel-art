/**
 * Purpose:
 * Dynamic editor route that loads a single artwork by id into the PixelCraft workspace.
 */
"use client";

import { useParams } from "next/navigation";

import { editor } from "@/content/editor";
import { EditorScreen } from "@/features/editor/components/EditorScreen";

export default function EditorPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";

  if (!id) {
    return (
      <main className="p-8 text-center text-muted">{editor.route.missingId}</main>
    );
  }

  return <EditorScreen artworkId={id} />;
}
