import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { DataTable, Td } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/session";
import { dashboardRoles } from "@/lib/permissions/roles";

export default async function DepartmentDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(dashboardRoles);
  const resolvedParams = await params;
  const supabase = await createClient();

  const { data: department } = await supabase
    .from("departments")
    .select("*")
    .eq("id", resolvedParams.id)
    .single();

  if (!department) notFound();

  const { data: respondents } = await supabase
    .from("respondents")
    .select("*")
    .eq("department_id", resolvedParams.id)
    .order("created_at", { ascending: false });

  return (
    <>
      <PageHeader title={department.name} description={department.description ?? undefined} />
      <div className="mb-6 grid gap-4 rounded-lg border bg-card p-5 shadow-sm sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase text-muted-foreground">Code</p>
          <p className="mt-1 font-medium">{department.code ?? "-"}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-muted-foreground">Status</p>
          <p className="mt-1">
            <StatusBadge active={department.is_active} />
          </p>
        </div>
        <div>
          <p className="text-xs uppercase text-muted-foreground">Manager</p>
          <p className="mt-1 font-medium">{department.manager_name ?? "-"}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-muted-foreground">Manager Email</p>
          <p className="mt-1 font-medium">{department.manager_email ?? "-"}</p>
        </div>
      </div>
      <PageHeader title="Respondents" />
      {respondents?.length ? (
        <DataTable headers={["Name", "Designation", "Email", "Access", "Status"]}>
          {respondents.map((respondent) => (
            <tr key={respondent.id}>
              <Td className="font-medium">{respondent.full_name}</Td>
              <Td>{respondent.designation ?? "-"}</Td>
              <Td>{respondent.email ?? "-"}</Td>
              <Td>{respondent.access_type}</Td>
              <Td>
                <StatusBadge active={respondent.is_active} />
              </Td>
            </tr>
          ))}
        </DataTable>
      ) : (
        <EmptyState
          title="No respondents"
          description="No respondents are linked to this department yet."
        />
      )}
    </>
  );
}
