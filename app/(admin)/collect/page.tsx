import Link from "next/link";
import { MessageSquareText } from "lucide-react";
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

export default async function CollectAnswersPage() {
  await requireRole(dashboardRoles);
  const supabase = await createClient();
  const { data } = await supabase
    .from("questionnaires")
    .select("id,title,description,target_department_type,estimated_minutes,status,is_active,questions(count)")
    .eq("is_active", true)
    .order("title");

  const questionnaires = (data ?? []) as unknown as QuestionnaireRow[];

  return (
    <>
      <PageHeader
        title="Collect Answers"
        description="Open a questionnaire, meet the responsible person, ask the questions, and type the answers."
      />

      <section className="mb-5 rounded-lg border bg-teal-50 p-4 text-sm text-teal-900 shadow-sm">
        <div className="flex items-start gap-3">
          <MessageSquareText className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">Simple in-person collection</p>
            <p className="mt-1">
              Choose the questionnaire below, select the person you are meeting,
              then enter answers while asking each question.
            </p>
          </div>
        </div>
      </section>

      {questionnaires.length ? (
        <DataTable headers={["Questionnaire", "Department Type", "Questions", "Status", "Action"]}>
          {questionnaires.map((questionnaire) => (
            <tr key={questionnaire.id}>
              <Td>
                <p className="font-medium text-primary">{questionnaire.title}</p>
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
              <Td>
                <Link
                  href={`/collect/${questionnaire.id}`}
                  className="inline-flex min-h-10 items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                >
                  Open and collect
                </Link>
              </Td>
            </tr>
          ))}
        </DataTable>
      ) : (
        <EmptyState
          title="No questionnaires found"
          description="Create or seed questionnaires before collecting answers."
        />
      )}
    </>
  );
}
