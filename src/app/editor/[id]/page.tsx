/**
 * Purpose:
 * Dynamic editor route that loads a single artwork by id into the PixelCraft workspace.
 */
"use client";

import { useParams } from "next/navigation";

import { EditorScreen } from "@/features/editor/components/EditorScreen";

export default function EditorPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";

  if (!id) {
    return (
      <div className="p-8 text-center text-zinc-500">Missing artwork id.</div>
    );
  }

  return <EditorScreen artworkId={id} />;
}
