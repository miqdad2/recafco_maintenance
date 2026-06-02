import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable, Td } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { DeleteDepartmentButton } from "@/components/departments/delete-department-button";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/session";
import { adminRoles, dashboardRoles } from "@/lib/permissions/roles";

export default async function DepartmentsPage() {
  const currentUser = await requireRole(dashboardRoles);
  const canManage = adminRoles.includes(currentUser.profile.role);
  const supabase = await createClient();
  const { data: departments } = await supabase
    .from("departments")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (
    <>
      <PageHeader
        title="Departments"
        description="Maintain the department list used for respondents and assignments."
        action={{ href: "/departments/new", label: "New department" }}
      />
      {departments?.length ? (
        <DataTable
          headers={
            canManage
              ? ["Department", "Manager", "Email", "Status", "Updated", "Actions"]
              : ["Department", "Manager", "Email", "Status", "Updated"]
          }
        >
          {departments.map((department) => (
            <tr key={department.id}>
              <Td>
                <Link href={`/departments/${department.id}`} className="font-medium text-primary">
                  {department.name}
                </Link>
                <div className="text-xs text-muted-foreground">{department.code ?? "No code"}</div>
              </Td>
              <Td>{department.manager_name ?? "-"}</Td>
              <Td>{department.manager_email ?? "-"}</Td>
              <Td>
                <StatusBadge active={department.is_active} />
              </Td>
              <Td>{new Date(department.updated_at).toLocaleDateString()}</Td>
              {canManage ? (
                <Td>
                  <DeleteDepartmentButton
                    departmentId={department.id}
                    departmentName={department.name}
                  />
                </Td>
              ) : null}
            </tr>
          ))}
        </DataTable>
      ) : (
        <EmptyState
          title="No departments found"
          description="Add the first department to start collecting structured requirements."
        />
      )}
    </>
  );
}
