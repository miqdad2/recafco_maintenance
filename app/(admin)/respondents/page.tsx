import { PageHeader } from "@/components/layout/page-header";
import { DataTable, Td } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/session";
import { dashboardRoles } from "@/lib/permissions/roles";

type RespondentRow = {
  id: string;
  full_name: string;
  designation: string | null;
  email: string | null;
  access_type: string;
  is_active: boolean;
  departments: { name: string }[] | null;
};

export default async function RespondentsPage() {
  await requireRole(dashboardRoles);
  const supabase = await createClient();
  const { data } = await supabase
    .from("respondents")
    .select("id,full_name,designation,email,access_type,is_active,departments(name)")
    .order("created_at", { ascending: false });

  const respondents = (data ?? []) as unknown as RespondentRow[];

  return (
    <>
      <PageHeader
        title="Respondents"
        description="People who will answer requirement questionnaires by department."
        action={{ href: "/respondents/new", label: "New respondent" }}
      />
      {respondents.length ? (
        <DataTable headers={["Respondent", "Department", "Designation", "Access", "Status"]}>
          {respondents.map((respondent) => (
            <tr key={respondent.id}>
              <Td>
                <p className="font-medium">{respondent.full_name}</p>
                <p className="text-xs text-muted-foreground">{respondent.email ?? "No email"}</p>
              </Td>
              <Td>{respondent.departments?.[0]?.name ?? "-"}</Td>
              <Td>{respondent.designation ?? "-"}</Td>
              <Td>{respondent.access_type}</Td>
              <Td>
                <StatusBadge active={respondent.is_active} />
              </Td>
            </tr>
          ))}
        </DataTable>
      ) : (
        <EmptyState
          title="No respondents found"
          description="Add respondents after creating departments."
        />
      )}
    </>
  );
}
