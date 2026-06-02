import { PageHeader } from "@/components/layout/page-header";
import { FormSection } from "@/components/forms/form-section";
import { Field } from "@/components/forms/field";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/session";
import { adminRoles } from "@/lib/permissions/roles";
import { createAssignment } from "../../actions";

type RespondentOption = {
  id: string;
  full_name: string;
  designation: string | null;
  departments: { name: string }[] | null;
};

export default async function NewAssignmentPage() {
  await requireRole(adminRoles);
  const supabase = await createClient();
  const [{ data: questionnaires }, { data: respondents }] =
    await Promise.all([
      supabase
        .from("questionnaires")
        .select("id,title")
        .eq("is_active", true)
        .eq("status", "published")
        .order("title"),
      supabase
        .from("respondents")
        .select("id,full_name,designation,departments(name)")
        .eq("is_active", true)
        .order("full_name")
    ]);

  const respondentOptions = (respondents ?? []) as unknown as RespondentOption[];

  return (
    <>
      <PageHeader
        title="Send Questions"
        description="Choose the questions and the person. The system will create one secure link."
      />
      <form action={createAssignment} className="max-w-3xl">
        <FormSection
          title="Who should answer?"
          description="Only two choices are needed. No login is required for the respondent."
        >
          <Field label="Questionnaire">
            <Select name="questionnaire_id" required>
              <option value="">Select questionnaire</option>
              {questionnaires?.map((questionnaire) => (
                <option key={questionnaire.id} value={questionnaire.id}>
                  {questionnaire.title}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Respondent">
            <Select name="respondent_id" required>
              <option value="">Select respondent</option>
              {respondentOptions.map((respondent) => (
                <option key={respondent.id} value={respondent.id}>
                  {respondent.full_name}
                  {" - "}
                  {respondent.departments?.[0]?.name ?? "No department"}
                </option>
              ))}
            </Select>
          </Field>
          <div className="rounded-md border bg-teal-50 px-4 py-3 text-sm text-teal-900">
            Next step: click Create link, then copy the link from Send Questions.
            You can send it to them or open it yourself during a meeting.
          </div>
          <div>
            <Button type="submit">Create link</Button>
          </div>
        </FormSection>
      </form>
    </>
  );
}
