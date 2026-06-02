import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile, UserRole } from "@/types/database";

export type CurrentUser = {
  id: string;
  email: string;
  profile: Profile;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user?.email) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .eq("is_active", true)
    .single();

  if (!profile) return null;

  return {
    id: user.id,
    email: user.email,
    profile: profile as Profile
  };
}

export async function requireUser() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");
  return currentUser;
}

export async function requireRole(roles: UserRole[]) {
  const currentUser = await requireUser();
  if (!roles.includes(currentUser.profile.role)) redirect("/unauthorized");
  return currentUser;
}
