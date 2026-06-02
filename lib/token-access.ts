import { createAdminClient } from "@/lib/supabase/admin";

export type TokenAssignment = {
  id: string;
  questionnaire_id: string;
  respondent_id: string;
  department_id: string;
  status: string;
  secure_token: string;
  token_expires_at: string | null;
  submitted_at: string | null;
  progress_percent: number;
  questionnaires: { title: string; description: string | null; status: string; is_active: boolean } | null;
  respondents: { full_name: string; designation: string | null; is_active: boolean } | null;
  departments: { name: string } | null;
};

export type TokenValidationResult =
  | { ok: true; assignment: TokenAssignment }
  | { ok: false; reason: "invalid" | "expired" | "inactive" };

export async function validateTokenAssignment(token: string): Promise<TokenValidationResult> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("questionnaire_assignments")
    .select("id,questionnaire_id,respondent_id,department_id,status,secure_token,token_expires_at,submitted_at,progress_percent,questionnaires(title,description,status,is_active),respondents(full_name,designation,is_active),departments(name)")
    .eq("secure_token", token)
    .maybeSingle();

  if (!data) return { ok: false, reason: "invalid" };

  const assignment = data as unknown as TokenAssignment;

  if (assignment.token_expires_at && new Date(assignment.token_expires_at) <= new Date()) {
    return { ok: false, reason: "expired" };
  }

  if (
    !assignment.respondents?.is_active ||
    !assignment.questionnaires?.is_active ||
    assignment.questionnaires.status !== "published" ||
    assignment.status === "expired"
  ) {
    return { ok: false, reason: "inactive" };
  }

  return { ok: true, assignment };
}
