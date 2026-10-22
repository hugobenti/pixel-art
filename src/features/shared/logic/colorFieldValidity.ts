import { parseHexColor } from "@/features/shared/utils/colorConverter";

export function isColorFieldDraftValid(draft: string): boolean {
  return parseHexColor(draft) !== null;
}
