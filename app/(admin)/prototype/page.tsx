import { PageHeader } from "@/components/layout/page-header";
import { SystemPrototype } from "@/components/prototype/system-prototype";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/session";
import { dashboardRoles } from "@/lib/permissions/roles";

export default async function PrototypePage() {
  await requireRole(dashboardRoles);
  const supabase = await createClient();

  const [
    { count: questionnaires },
    { count: questions },
    { count: departments },
    { count: respondents }
  ] = await Promise.all([
    supabase.from("questionnaires").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("questions").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("departments").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("respondents").select("*", { count: "exact", head: true }).eq("is_active", true)
  ]);

  return (
    <>
      <PageHeader
        title="System Prototype"
        description="Presentation view of the future maintenance system based on the requirement questions."
      />
      <SystemPrototype
        stats={{
          questionnaires: questionnaires ?? 0,
          questions: questions ?? 0,
          departments: departments ?? 0,
          respondents: respondents ?? 0
        }}
      />
    </>
  );
}
