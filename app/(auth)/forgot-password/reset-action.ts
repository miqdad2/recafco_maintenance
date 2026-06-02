"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const supabase = await createClient();
  const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/reset-password`;
  await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  redirect("/login");
}
