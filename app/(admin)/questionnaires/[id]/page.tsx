import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable, Td } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/session";
import { dashboardRoles } from "@/lib/permissions/roles";

type QuestionnaireDetail = {
  id: string;
  title: string;
  description: string | null;
  target_department_type: string | null;
  estimated_minutes: number | null;
  status: string;
  is_active: boolean;
};

type QuestionRow = {
  id: string;
  question_text: string;
  help_text: string | null;
  question_type: string;
  is_required: boolean;
  sort_order: number;
};

export default async function QuestionnaireDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(dashboardRoles);
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: questionnaireData }, { data: questionsData }] = await Promise.all([
    supabase
      .from("questionnaires")
      .select("id,title,description,target_department_type,estimated_minutes,status,is_active")
      .eq("id", id)
      .single(),
    supabase
      .from("questions")
      .select("id,question_text,help_text,question_type,is_required,sort_order")
      .eq("questionnaire_id", id)
      .eq("is_active", true)
      .order("sort_order")
  ]);

  if (!questionnaireData) notFound();

  const questionnaire = questionnaireData as QuestionnaireDetail;
  const questions = (questionsData ?? []) as QuestionRow[];

  return (
    <>
      <PageHeader
        title={questionnaire.title}
        description={questionnaire.description ?? undefined}
      />

      <section className="mb-6 rounded-lg border bg-card p-5 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-4">
          <div>
            <p className="text-xs uppercase text-muted-foreground">Target</p>
            <p className="mt-1 font-medium">{questionnaire.target_department_type ?? "-"}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-muted-foreground">Status</p>
            <p className="mt-1">
              <StatusBadge
                active={questionnaire.is_active && questionnaire.status === "published"}
                label={questionnaire.status}
              />
            </p>
          </div>
          <div>
            <p className="text-xs uppercase text-muted-foreground">Questions</p>
            <p className="mt-1 font-medium">{questions.length}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-muted-foreground">Estimated Time</p>
            <p className="mt-1 font-medium">
              {questionnaire.estimated_minutes ? `${questionnaire.estimated_minutes} min` : "-"}
            </p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href={`/questionnaires/${questionnaire.id}/map`}>
            <Button type="button" variant="secondary">View requirement map</Button>
          </Link>
          <Link href="/assignments/new">
            <Button type="button">Assign to IT Manager</Button>
          </Link>
          <Link
            href="/questionnaires"
            className="inline-flex min-h-10 items-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Back to questionnaires
          </Link>
        </div>
      </section>

      <PageHeader title="Questions" />
      <DataTable headers={["#", "Question", "Type", "Required"]}>
        {questions.map((question, index) => (
          <tr key={question.id}>
            <Td>{index + 1}</Td>
            <Td>
              <p className="font-medium">{question.question_text}</p>
              {question.help_text ? (
                <p className="mt-1 text-xs text-muted-foreground">{question.help_text}</p>
              ) : null}
            </Td>
            <Td>{question.question_type}</Td>
            <Td>{question.is_required ? "Yes" : "No"}</Td>
          </tr>
        ))}
      </DataTable>
    </>
  );
}
