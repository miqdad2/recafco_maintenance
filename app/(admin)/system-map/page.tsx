import { PageHeader } from "@/components/layout/page-header";
import { SystemRequirementMap } from "@/components/questionnaires/system-requirement-map";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/session";
import { dashboardRoles } from "@/lib/permissions/roles";

type QuestionnaireRow = {
  id: string;
  title: string;
  description: string | null;
  target_department_type: string | null;
  status: string;
};

type QuestionRow = {
  id: string;
  questionnaire_id: string;
  question_text: string;
  sort_order: number;
};

export default async function SystemMapPage() {
  await requireRole(dashboardRoles);
  const supabase = await createClient();

  const [{ data: questionnairesData }, { data: questionsData }] = await Promise.all([
    supabase
      .from("questionnaires")
      .select("id,title,description,target_department_type,status")
      .eq("is_active", true)
      .order("title"),
    supabase
      .from("questions")
      .select("id,questionnaire_id,question_text,sort_order")
      .eq("is_active", true)
      .order("sort_order")
  ]);

  const questionnaires = (questionnairesData ?? []) as QuestionnaireRow[];
  const questions = (questionsData ?? []) as QuestionRow[];

  return (
    <>
      <PageHeader
        title="System Map"
        description="Full visual map of all questionnaires and all questions for the future maintenance system."
      />
      <div className="mb-5">
        <Link
          href="/system-map-fullscreen"
          target="_blank"
          className="inline-flex min-h-10 items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Open full screen overview
        </Link>
      </div>
      <SystemRequirementMap questionnaires={questionnaires} questions={questions} />
    </>
  );
}
