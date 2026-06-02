import {
  Building2,
  CheckCircle2,
  ClipboardList,
  FileText,
  HelpCircle,
  ListChecks,
  Timer,
  Upload,
  UsersRound
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { DataTable, Td } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/session";
import { dashboardRoles } from "@/lib/permissions/roles";

export default async function DashboardPage() {
  await requireRole(dashboardRoles);
  const supabase = await createClient();

  const { data: stats } = await supabase
    .from("dashboard_stats")
    .select("*")
    .single();

  const { data: departments } = await supabase
    .from("departments")
    .select("id,name,code,is_active,created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  const cards = [
    ["Departments", stats?.total_departments ?? 0, Building2],
    ["Respondents", stats?.total_respondents ?? 0, UsersRound],
    ["Questionnaires", stats?.total_questionnaires ?? 0, ClipboardList],
    ["Questions", stats?.total_questions ?? 0, ListChecks],
    ["Assignments", stats?.total_assignments ?? 0, FileText],
    ["Submitted", stats?.submitted_assignments ?? 0, CheckCircle2],
    ["Pending", stats?.pending_assignments ?? 0, Timer],
    ["Files Uploaded", stats?.files_uploaded ?? 0, Upload],
    ["Open Follow-ups", stats?.open_follow_ups ?? 0, HelpCircle]
  ] as const;

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Phase 1 operational view for requirement collection setup and readiness."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(([title, value, icon]) => (
          <StatCard key={title} title={title} value={value} icon={icon} />
        ))}
      </div>

      <section className="mt-8">
        <PageHeader title="Recent Departments" />
        {departments?.length ? (
          <DataTable headers={["Name", "Code", "Status", "Created"]}>
            {departments.map((department) => (
              <tr key={department.id}>
                <Td className="font-medium">{department.name}</Td>
                <Td>{department.code ?? "-"}</Td>
                <Td>
                  <StatusBadge active={department.is_active} />
                </Td>
                <Td>{new Date(department.created_at).toLocaleDateString()}</Td>
              </tr>
            ))}
          </DataTable>
        ) : (
          <EmptyState
            title="No departments yet"
            description="Create departments before adding respondents and questionnaire assignments."
          />
        )}
      </section>
    </>
  );
}
