import { createClient } from "@supabase/supabase-js";
import { loadLocalEnv } from "./env";
import { buildQuestionnaireLink, defaultTokenExpiry, generateSecureToken } from "../lib/secure-tokens";

loadLocalEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const title = "IT Manager Questionnaire";
const questions = [
  "Is the system only for the Maintenance Department, or should it become a company-wide workflow system later?",
  "What is the phase 1 scope?",
  "What is the expected deadline for the first working version?",
  "Where should the system be hosted?",
  "Should the system be accessible outside the company network?",
  "Should login use company email, employee number, or username?",
  "Is two-factor authentication required?",
  "Should every action be audit logged?",
  "Should the system be English only or bilingual English/Arabic?",
  "Does company data need to stay inside company server or inside Kuwait?"
];

async function seedItManagerQuestionnaire() {
  const { data: existingDepartment, error: departmentFindError } = await supabase
    .from("departments")
    .select("id")
    .eq("code", "IT")
    .maybeSingle();

  if (departmentFindError) throw departmentFindError;

  let departmentId = existingDepartment?.id as string | undefined;

  if (!departmentId) {
    const { data, error } = await supabase
      .from("departments")
      .insert({
        name: "IT Department",
        code: "IT",
        description: "Information Technology department",
        manager_name: "IT Manager",
        is_active: true
      })
      .select("id")
      .single();

    if (error) throw error;
    departmentId = data.id;
  }

  const { data: existingRespondent, error: respondentFindError } = await supabase
    .from("respondents")
    .select("id")
    .eq("department_id", departmentId)
    .eq("full_name", "IT Manager")
    .maybeSingle();

  if (respondentFindError) throw respondentFindError;

  let respondentId = existingRespondent?.id as string | undefined;

  if (!respondentId) {
    const { data, error } = await supabase
      .from("respondents")
      .insert({
        department_id: departmentId,
        full_name: "IT Manager",
        designation: "IT Manager",
        access_type: "secure_token",
        is_active: true
      })
      .select("id")
      .single();

    if (error) throw error;
    respondentId = data.id;
  }

  const { data: existingQuestionnaire, error: findError } = await supabase
    .from("questionnaires")
    .select("id")
    .eq("title", title)
    .maybeSingle();

  if (findError) throw findError;

  let questionnaireId = existingQuestionnaire?.id as string | undefined;

  if (!questionnaireId) {
    const { data, error } = await supabase
      .from("questionnaires")
      .insert({
        title,
        description: "Requirement collection for IT scope, hosting, security, and system governance.",
        target_department_type: "IT",
        estimated_minutes: 20,
        status: "published",
        is_active: true
      })
      .select("id")
      .single();

    if (error) throw error;
    questionnaireId = data.id;
  }

  const { data: existingQuestions, error: questionFindError } = await supabase
    .from("questions")
    .select("question_text")
    .eq("questionnaire_id", questionnaireId);

  if (questionFindError) throw questionFindError;

  const existingText = new Set(
    (existingQuestions ?? []).map((question) => String(question.question_text))
  );

  const rows = questions
    .map((questionText, index) => ({
      questionnaire_id: questionnaireId,
      question_text: questionText,
      question_type: "long_text",
      is_required: true,
      is_active: true,
      sort_order: index + 1
    }))
    .filter((question) => !existingText.has(question.question_text));

  if (rows.length) {
    const { error } = await supabase.from("questions").insert(rows);
    if (error) throw error;
  }

  const { data: existingAssignment, error: assignmentFindError } = await supabase
    .from("questionnaire_assignments")
    .select("id,secure_token")
    .eq("questionnaire_id", questionnaireId)
    .eq("respondent_id", respondentId)
    .maybeSingle();

  if (assignmentFindError) throw assignmentFindError;

  let secureToken = existingAssignment?.secure_token as string | null | undefined;

  if (!existingAssignment || !secureToken) {
    secureToken = generateSecureToken();
    const assignmentPayload = {
      questionnaire_id: questionnaireId,
      respondent_id: respondentId,
      department_id: departmentId,
      status: "assigned",
      secure_token: secureToken,
      token_expires_at: defaultTokenExpiry(),
      progress_percent: 0
    };

    const request = existingAssignment
      ? supabase
          .from("questionnaire_assignments")
          .update(assignmentPayload)
          .eq("id", existingAssignment.id)
      : supabase.from("questionnaire_assignments").insert(assignmentPayload);

    const { error } = await request;
    if (error) throw error;
  }

  console.log(`IT Manager questionnaire ready with ${questions.length} questions.`);
  console.log(`IT Manager secure link: ${buildQuestionnaireLink(secureToken)}`);
}

seedItManagerQuestionnaire().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
