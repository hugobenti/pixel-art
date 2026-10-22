import type { IHistoryCommand } from "@/features/editor/types/editor.type";

/** A non-history document edit invalidates redo without discarding prior undo commands. */
export function discardRedoStack(stack: IHistoryCommand[]): void {
  stack.length = 0;
}
