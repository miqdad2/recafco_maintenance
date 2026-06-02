"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { departmentSchema } from "@/lib/validations/departments";
import { respondentSchema } from "@/lib/validations/respondents";
import { assignmentSchema } from "@/lib/validations/assignments";
import { requireRole } from "@/lib/auth/session";
import { adminRoles } from "@/lib/permissions/roles";
import { buildQuestionnaireLink, defaultTokenExpiry, generateSecureToken } from "@/lib/secure-tokens";
import { allowedUploadTypes, maxUploadSize } from "@/lib/validations/token-answers";

function cleanNullable(value: unknown) {
  const text = typeof value === "string" ? value.trim() : "";
  return text.length ? text : null;
}

function safeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function createDepartment(formData: FormData) {
  const currentUser = await requireRole(adminRoles);
  const parsed = departmentSchema.parse(Object.fromEntries(formData));
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("departments")
    .insert({
      name: parsed.name,
      code: cleanNullable(parsed.code),
      description: cleanNullable(parsed.description),
      manager_name: cleanNullable(parsed.manager_name),
      manager_email: cleanNullable(parsed.manager_email),
      is_active: parsed.is_active
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  await supabase.from("audit_logs").insert({
    user_id: currentUser.id,
    action: "create_department",
    entity_type: "departments",
    entity_id: data.id,
    new_values: parsed
  });

  revalidatePath("/departments");
  redirect("/departments");
}

export async function deactivateDepartment(formData: FormData) {
  const currentUser = await requireRole(adminRoles);
  const departmentId = String(formData.get("department_id") ?? "");
  const supabase = await createClient();

  const { data: department, error: readError } = await supabase
    .from("departments")
    .select("*")
    .eq("id", departmentId)
    .single();

  if (readError) throw new Error(readError.message);

  const { error } = await supabase
    .from("departments")
    .update({ is_active: false })
    .eq("id", departmentId);

  if (error) throw new Error(error.message);

  await supabase.from("audit_logs").insert({
    user_id: currentUser.id,
    action: "deactivate_department",
    entity_type: "departments",
    entity_id: departmentId,
    old_values: department,
    new_values: { is_active: false }
  });

  revalidatePath("/departments");
  revalidatePath("/dashboard");
}

export async function createRespondent(formData: FormData) {
  const currentUser = await requireRole(adminRoles);
  const parsed = respondentSchema.parse(Object.fromEntries(formData));
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("respondents")
    .insert({
      department_id: parsed.department_id,
      profile_id: cleanNullable(parsed.profile_id),
      full_name: parsed.full_name,
      designation: cleanNullable(parsed.designation),
      email: cleanNullable(parsed.email),
      phone: cleanNullable(parsed.phone),
      access_type: parsed.access_type,
      notes: cleanNullable(parsed.notes),
      is_active: parsed.is_active
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  await supabase.from("audit_logs").insert({
    user_id: currentUser.id,
    action: "create_respondent",
    entity_type: "respondents",
    entity_id: data.id,
    new_values: parsed
  });

  revalidatePath("/respondents");
  redirect("/respondents");
}

export async function quickCreateRespondent(formData: FormData) {
  const currentUser = await requireRole(adminRoles);
  const questionnaireId = String(formData.get("questionnaire_id") ?? "");
  const fullName = String(formData.get("full_name") ?? "").trim();
  const designation = String(formData.get("designation") ?? "").trim();
  let departmentId = String(formData.get("department_id") ?? "");
  const departmentName = String(formData.get("department_name") ?? "").trim();
  const supabase = await createClient();

  if (!fullName || (!departmentId && !departmentName)) {
    redirect(`/collect/${questionnaireId}?error=respondent_required`);
  }

  if (!departmentId && departmentName) {
    const departmentCode = departmentName
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 30);

    const { data: existingDepartment } = await supabase
      .from("departments")
      .select("id")
      .or(`name.eq.${departmentName},code.eq.${departmentCode}`)
      .maybeSingle();

    if (existingDepartment?.id) {
      departmentId = existingDepartment.id;
    } else {
      const { data: newDepartment, error: departmentError } = await supabase
        .from("departments")
        .insert({
          name: departmentName,
          code: departmentCode || null,
          is_active: true
        })
        .select("id")
        .single();

      if (departmentError) throw new Error(departmentError.message);
      departmentId = newDepartment.id;

      await supabase.from("audit_logs").insert({
        user_id: currentUser.id,
        action: "create_department",
        entity_type: "departments",
        entity_id: departmentId,
        new_values: { name: departmentName, code: departmentCode, source: "collect_answers" }
      });
    }
  }

  const { data, error } = await supabase
    .from("respondents")
    .insert({
      department_id: departmentId,
      full_name: fullName,
      designation: designation || null,
      access_type: "secure_token",
      is_active: true
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  await supabase.from("audit_logs").insert({
    user_id: currentUser.id,
    action: "create_respondent",
    entity_type: "respondents",
    entity_id: data.id,
    new_values: {
      full_name: fullName,
      designation: designation || null,
      department_id: departmentId,
      source: "collect_answers"
    }
  });

  revalidatePath(`/collect/${questionnaireId}`);
  redirect(`/collect/${questionnaireId}?respondent_added=1`);
}

export async function createAssignment(formData: FormData) {
  const currentUser = await requireRole(adminRoles);
  const parsed = assignmentSchema.parse(Object.fromEntries(formData));
  const supabase = await createClient();
  const secureToken = generateSecureToken();
  const tokenExpiresAt = parsed.token_expires_at
    ? new Date(parsed.token_expires_at).toISOString()
    : defaultTokenExpiry();

  const { data: respondent, error: respondentError } = await supabase
    .from("respondents")
    .select("id,department_id")
    .eq("id", parsed.respondent_id)
    .single();

  if (respondentError || !respondent) {
    throw new Error("Selected respondent was not found.");
  }

  const { data, error } = await supabase
    .from("questionnaire_assignments")
    .insert({
      questionnaire_id: parsed.questionnaire_id,
      respondent_id: parsed.respondent_id,
      department_id: respondent.department_id,
      assigned_by: currentUser.id,
      status: "assigned",
      secure_token: secureToken,
      token_expires_at: tokenExpiresAt,
      due_date: cleanNullable(parsed.due_date)
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  await supabase.from("audit_logs").insert({
    user_id: currentUser.id,
    action: "token_generated",
    entity_type: "questionnaire_assignments",
    entity_id: data.id,
    new_values: {
      token_expires_at: tokenExpiresAt,
      link: buildQuestionnaireLink(secureToken)
    }
  });

  revalidatePath("/assignments");
  redirect("/assignments");
}

export async function regenerateAssignmentToken(formData: FormData) {
  const currentUser = await requireRole(adminRoles);
  const assignmentId = String(formData.get("assignment_id") ?? "");
  const tokenExpiresAtRaw = String(formData.get("token_expires_at") ?? "");
  const secureToken = generateSecureToken();
  const tokenExpiresAt = tokenExpiresAtRaw
    ? new Date(tokenExpiresAtRaw).toISOString()
    : defaultTokenExpiry();
  const supabase = await createClient();

  const { error } = await supabase
    .from("questionnaire_assignments")
    .update({
      secure_token: secureToken,
      token_expires_at: tokenExpiresAt
    })
    .eq("id", assignmentId);

  if (error) throw new Error(error.message);

  await supabase.from("audit_logs").insert({
    user_id: currentUser.id,
    action: "token_regenerated",
    entity_type: "questionnaire_assignments",
    entity_id: assignmentId,
    new_values: {
      token_expires_at: tokenExpiresAt,
      link: buildQuestionnaireLink(secureToken)
    }
  });

  revalidatePath("/assignments");
}

export async function deleteAssignmentLink(formData: FormData) {
  const currentUser = await requireRole(adminRoles);
  const assignmentId = String(formData.get("assignment_id") ?? "");
  const supabase = await createClient();

  const { data: assignment, error: readError } = await supabase
    .from("questionnaire_assignments")
    .select("*")
    .eq("id", assignmentId)
    .single();

  if (readError) throw new Error(readError.message);

  const { error } = await supabase
    .from("questionnaire_assignments")
    .update({
      status: "expired",
      secure_token: null,
      token_expires_at: null
    })
    .eq("id", assignmentId);

  if (error) throw new Error(error.message);

  await supabase.from("audit_logs").insert({
    user_id: currentUser.id,
    action: "delete_question_link",
    entity_type: "questionnaire_assignments",
    entity_id: assignmentId,
    old_values: assignment,
    new_values: {
      status: "expired",
      secure_token: null,
      token_expires_at: null
    }
  });

  revalidatePath("/assignments");
  revalidatePath("/collect");
}

export async function reopenSubmission(formData: FormData) {
  const currentUser = await requireRole(adminRoles);
  const assignmentId = String(formData.get("assignment_id") ?? "");
  const supabase = await createClient();

  const { error } = await supabase
    .from("questionnaire_assignments")
    .update({
      status: "reopened",
      reviewed_at: null,
      reviewed_by: null
    })
    .eq("id", assignmentId);

  if (error) throw new Error(error.message);

  await supabase.from("answers").update({ status: "draft" }).eq("assignment_id", assignmentId);
  await supabase.from("audit_logs").insert({
    user_id: currentUser.id,
    action: "submission_reopened",
    entity_type: "questionnaire_assignments",
    entity_id: assignmentId
  });

  revalidatePath("/assignments");
}

export async function collectAnswersDirectly(formData: FormData) {
  const currentUser = await requireRole(adminRoles);
  const questionnaireId = String(formData.get("questionnaire_id") ?? "");
  const respondentId = String(formData.get("respondent_id") ?? "");
  const intent = String(formData.get("intent") ?? "draft");
  const supabase = await createClient();
  const upload = formData.get("supporting_file");

  const [{ data: respondent }, { data: questions }] = await Promise.all([
    supabase
      .from("respondents")
      .select("id,department_id")
      .eq("id", respondentId)
      .eq("is_active", true)
      .single(),
    supabase
      .from("questions")
      .select("id,is_required")
      .eq("questionnaire_id", questionnaireId)
      .eq("is_active", true)
      .order("sort_order")
  ]);

  if (!respondent) throw new Error("Select a valid respondent.");

  const activeQuestions = questions ?? [];
  if (intent === "submit") {
    const missingRequired = activeQuestions.some((question) => {
      const answer = String(formData.get(`answer_${question.id}`) ?? "").trim();
      return question.is_required && !answer;
    });

    if (missingRequired) {
      redirect(`/collect/${questionnaireId}?error=missing_required`);
    }
  }

  const { data: existingAssignment } = await supabase
    .from("questionnaire_assignments")
    .select("id,status,submitted_at")
    .eq("questionnaire_id", questionnaireId)
    .eq("respondent_id", respondentId)
    .in("status", ["assigned", "in_progress", "reopened"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let assignmentId = existingAssignment?.id as string | undefined;

  if (!assignmentId) {
    const secureToken = generateSecureToken();
    const { data: assignment, error } = await supabase
      .from("questionnaire_assignments")
      .insert({
        questionnaire_id: questionnaireId,
        respondent_id: respondentId,
        department_id: respondent.department_id,
        assigned_by: currentUser.id,
        status: "assigned",
        secure_token: secureToken,
        token_expires_at: defaultTokenExpiry()
      })
      .select("id")
      .single();

    if (error) throw new Error(error.message);
    assignmentId = assignment.id;

    await supabase.from("audit_logs").insert({
      user_id: currentUser.id,
      action: "token_generated",
      entity_type: "questionnaire_assignments",
      entity_id: assignmentId,
      new_values: { collection_mode: "in_person" }
    });
  }

  const answeredCount = activeQuestions.filter((question) =>
    String(formData.get(`answer_${question.id}`) ?? "").trim()
  ).length;
  const progressPercent = activeQuestions.length
    ? Math.round((answeredCount / activeQuestions.length) * 100)
    : 0;
  const answerStatus = intent === "submit" ? "submitted" : "draft";

  for (const question of activeQuestions) {
    const answerText = String(formData.get(`answer_${question.id}`) ?? "").trim();
    if (!answerText && intent === "draft") continue;

    await supabase.from("answers").upsert(
      {
        assignment_id: assignmentId,
        question_id: question.id,
        respondent_id: respondentId,
        answer_text: answerText || null,
        status: answerStatus
      },
      { onConflict: "assignment_id,question_id" }
    );
  }

  await supabase
    .from("questionnaire_assignments")
    .update({
      status: intent === "submit" ? "submitted" : "in_progress",
      progress_percent: progressPercent,
      submitted_at: intent === "submit" ? new Date().toISOString() : existingAssignment?.submitted_at ?? null
    })
    .eq("id", assignmentId);

  if (upload instanceof File && upload.size > 0) {
    if (upload.size > maxUploadSize || !allowedUploadTypes.has(upload.type)) {
      redirect(`/collect/${questionnaireId}?error=file_invalid`);
    }

    const filePath = `${assignmentId}/${crypto.randomUUID()}-${safeFileName(upload.name)}`;
    const { error: uploadError } = await supabase.storage
      .from("requirement-files")
      .upload(filePath, upload, {
        contentType: upload.type,
        upsert: false
      });

    if (uploadError) throw new Error(uploadError.message);

    const { error: fileRecordError } = await supabase.from("answer_files").insert({
      assignment_id: assignmentId,
      uploaded_by: currentUser.id,
      file_name: upload.name,
      file_path: filePath,
      file_type: upload.type,
      file_size: upload.size,
      description: "Collected during in-person requirement interview"
    });

    if (fileRecordError) {
      await supabase.storage.from("requirement-files").remove([filePath]);
      throw new Error(fileRecordError.message);
    }
  }

  await supabase.from("audit_logs").insert({
    user_id: currentUser.id,
    action: intent === "submit" ? "final_submitted_in_person" : "draft_saved_in_person",
    entity_type: "questionnaire_assignments",
    entity_id: assignmentId,
    new_values: { progress_percent: progressPercent }
  });

  revalidatePath("/collect");
  revalidatePath(`/collect/${questionnaireId}`);

  if (intent === "submit") {
    redirect(`/submissions/${assignmentId}`);
  }

  redirect(`/collect/${questionnaireId}?saved=1`);
}
