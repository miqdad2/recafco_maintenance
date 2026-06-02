"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { usernameToInternalEmail } from "@/lib/auth/username";

export async function login(formData: FormData) {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/dashboard");
  let email = "";

  try {
    email = usernameToInternalEmail(username);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid username.";
    redirect(`/login?error=${encodeURIComponent(message)}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  await supabase
    .from("profiles")
    .update({ last_login_at: new Date().toISOString() })
    .eq("email", email);

  redirect(next.startsWith("/") ? next : "/dashboard");
}
