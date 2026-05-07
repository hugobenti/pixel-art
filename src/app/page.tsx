/**
 * Purpose:
 * Application entry route — forwards users to the artwork gallery.
 */
import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/gallery");
}
