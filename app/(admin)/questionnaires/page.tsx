import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable, Td } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/session";
import { dashboardRoles } from "@/lib/permissions/roles";

type QuestionnaireRow = {
  id: string;
  title: string;
  description: string | null;
  target_department_type: string | null;
  estimated_minutes: number | null;
  status: string;
  is_active: boolean;
  questions: { count: number }[];
};

export default async function QuestionnairesPage() {
  await requireRole(dashboardRoles);
  const supabase = await createClient();
  const { data } = await supabase
    .from("questionnaires")
    .select("id,title,description,target_department_type,estimated_minutes,status,is_active,questions(count)")
    .order("title");

  const questionnaires = (data ?? []) as unknown as QuestionnaireRow[];

  return (
    <>
      <PageHeader
        title="Questionnaires"
        description="View published requirement questionnaires and their questions before assigning them."
      />
      {questionnaires.length ? (
        <DataTable headers={["Questionnaire", "Department Type", "Questions", "Status", "Time"]}>
          {questionnaires.map((questionnaire) => (
            <tr key={questionnaire.id}>
              <Td>
                <Link
                  href={`/questionnaires/${questionnaire.id}`}
                  className="font-medium text-primary"
                >
                  {questionnaire.title}
                </Link>
                <p className="mt-1 max-w-xl text-xs text-muted-foreground">
                  {questionnaire.description ?? "No description"}
                </p>
              </Td>
              <Td>{questionnaire.target_department_type ?? "-"}</Td>
              <Td>{questionnaire.questions?.[0]?.count ?? 0}</Td>
              <Td>
                <StatusBadge
                  active={questionnaire.is_active && questionnaire.status === "published"}
                  label={questionnaire.status}
                />
              </Td>
              <Td>{questionnaire.estimated_minutes ? `${questionnaire.estimated_minutes} min` : "-"}</Td>
            </tr>
          ))}
        </DataTable>
      ) : (
        <EmptyState
          title="No questionnaires found"
          description="Run the default questionnaire seed, then assign the IT Manager questionnaire."
        />
      )}
    </>
  );
}
