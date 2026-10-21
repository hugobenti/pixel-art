import { cx } from "@/features/shared/utils/cx";

const message = "mx-auto max-w-lg px-4 py-16 text-center";

export const editorScreen = {
  error: message,
  errorText: "text-red-600",
  backLink: "mt-4 inline-block text-zinc-700 underline",
  loading: cx(message, "text-zinc-500"),
};
