import { SystemMapFullscreen } from "@/components/questionnaires/system-map-fullscreen";
import { requireRole } from "@/lib/auth/session";
import { dashboardRoles } from "@/lib/permissions/roles";
import { createClient } from "@/lib/supabase/server";

type QuestionnaireRow = {
  id: string;
  title: string;
  target_department_type: string | null;
};

type QuestionRow = {
  id: string;
  questionnaire_id: string;
  question_text: string;
  sort_order: number;
};

export const dynamic = "force-dynamic";

export default async function FullscreenSystemMapPage() {
  await requireRole(dashboardRoles);
  const supabase = await createClient();
  const [{ data: questionnairesData }, { data: questionsData }] = await Promise.all([
    supabase
      .from("questionnaires")
      .select("id,title,target_department_type")
      .eq("is_active", true)
      .order("title"),
    supabase
      .from("questions")
      .select("id,questionnaire_id,question_text,sort_order")
      .eq("is_active", true)
      .order("sort_order")
  ]);

  return (
    <SystemMapFullscreen
      questionnaires={(questionnairesData ?? []) as QuestionnaireRow[]}
      questions={(questionsData ?? []) as QuestionRow[]}
    />
  );
}
