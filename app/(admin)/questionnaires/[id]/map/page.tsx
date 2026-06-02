import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { RequirementMap } from "@/components/questionnaires/requirement-map";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/session";
import { dashboardRoles } from "@/lib/permissions/roles";

type QuestionnaireDetail = {
  id: string;
  title: string;
  description: string | null;
};

type QuestionRow = {
  id: string;
  question_text: string;
  sort_order: number;
};

export default async function QuestionnaireMapPage({
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
      .select("id,title,description")
      .eq("id", id)
      .single(),
    supabase
      .from("questions")
      .select("id,question_text,sort_order")
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
        title="Requirement Map"
        description="Visual view of how questionnaire answers support system design."
      />
      <div className="mb-5">
        <Link
          href={`/questionnaires/${questionnaire.id}`}
          className="inline-flex min-h-10 items-center gap-2 rounded-md border bg-card px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to questionnaire
        </Link>
      </div>
      <RequirementMap questionnaireTitle={questionnaire.title} questions={questions} />
    </>
  );
}
