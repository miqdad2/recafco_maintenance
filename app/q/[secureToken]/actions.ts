"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateTokenAssignment } from "@/lib/token-access";
import {
  allowedUploadTypes,
  maxUploadSize,
  tokenAnswerActionSchema
} from "@/lib/validations/token-answers";

function cleanAnswer(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function safeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function saveTokenQuestionnaire(formData: FormData) {
  const parsed = tokenAnswerActionSchema.parse({
    secure_token: formData.get("secure_token"),
    intent: formData.get("intent")
  });

  const validation = await validateTokenAssignment(parsed.secure_token);
  if (!validation.ok) redirect(`/q/${parsed.secure_token}?state=${validation.reason}`);

  const assignment = validation.assignment;
  const isLocked =
    ["submitted", "reviewed", "approved"].includes(assignment.status) &&
    assignment.status !== "reopened";

  if (isLocked) redirect(`/q/${parsed.secure_token}?state=locked`);

  const supabase = createAdminClient();
  const { data: questions } = await supabase
    .from("questions")
    .select("id,question_text,question_type,is_required")
    .eq("questionnaire_id", assignment.questionnaire_id)
    .eq("is_active", true)
    .order("sort_order");

  const activeQuestions = questions ?? [];
  const missingRequired = activeQuestions.filter((question) => {
    if (!question.is_required || parsed.intent === "draft") return false;
    return cleanAnswer(formData.get(`answer_${question.id}`)).length === 0;
  });

  if (missingRequired.length) {
    redirect(`/q/${parsed.secure_token}?state=missing_required`);
  }

  const answeredCount = activeQuestions.filter(
    (question) => cleanAnswer(formData.get(`answer_${question.id}`)).length > 0
  ).length;
  const progressPercent = activeQuestions.length
    ? Math.round((answeredCount / activeQuestions.length) * 100)
    : 0;
  const answerStatus = parsed.intent === "submit" ? "submitted" : "draft";

  for (const question of activeQuestions) {
    const answer = cleanAnswer(formData.get(`answer_${question.id}`));
    if (!answer && parsed.intent === "draft") continue;

    await supabase.from("answers").upsert(
      {
        assignment_id: assignment.id,
        question_id: question.id,
        respondent_id: assignment.respondent_id,
        answer_text: answer || null,
        status: answerStatus
      },
      { onConflict: "assignment_id,question_id" }
    );
  }

  const upload = formData.get("assignment_file");
  if (upload instanceof File && upload.size > 0) {
    if (upload.size > maxUploadSize || !allowedUploadTypes.has(upload.type)) {
      redirect(`/q/${parsed.secure_token}?state=file_invalid`);
    }

    const filePath = `${assignment.id}/${crypto.randomUUID()}-${safeFileName(upload.name)}`;
    const { error: uploadError } = await supabase.storage
      .from("requirement-files")
      .upload(filePath, upload, {
        contentType: upload.type,
        upsert: false
      });

    if (uploadError) throw new Error(uploadError.message);

    const { error: fileRecordError } = await supabase.from("answer_files").insert({
      assignment_id: assignment.id,
      file_name: upload.name,
      file_path: filePath,
      file_type: upload.type,
      file_size: upload.size
    });

    if (fileRecordError) {
      await supabase.storage.from("requirement-files").remove([filePath]);
      throw new Error(fileRecordError.message);
    }
  }

  const assignmentStatus = parsed.intent === "submit" ? "submitted" : "in_progress";
  await supabase
    .from("questionnaire_assignments")
    .update({
      status: assignmentStatus,
      progress_percent: progressPercent,
      submitted_at: parsed.intent === "submit" ? new Date().toISOString() : assignment.submitted_at
    })
    .eq("id", assignment.id);

  await supabase.from("audit_logs").insert({
    user_id: null,
    action: parsed.intent === "submit" ? "final_submitted_by_token" : "draft_saved_by_token",
    entity_type: "questionnaire_assignments",
    entity_id: assignment.id,
    new_values: { progress_percent: progressPercent }
  });

  revalidatePath(`/q/${parsed.secure_token}`);
  redirect(`/q/${parsed.secure_token}?state=${parsed.intent === "submit" ? "submitted" : "saved"}`);
}
