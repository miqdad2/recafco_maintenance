import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Save, UserPlus } from "lucide-react";
import { collectAnswersDirectly, quickCreateRespondent } from "../../actions";
import { PageHeader } from "@/components/layout/page-header";
import { Field } from "@/components/forms/field";
import { Select } from "@/components/ui/select";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/files/file-uploader";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/session";
import { adminRoles } from "@/lib/permissions/roles";

type RespondentOption = {
  id: string;
  full_name: string;
  designation: string | null;
  departments: { name: string }[] | null;
};

type QuestionRow = {
  id: string;
  question_text: string;
  help_text: string | null;
  is_required: boolean;
  sort_order: number;
};

export default async function CollectQuestionnairePage({
  params,
  searchParams
}: {
  params: Promise<{ questionnaireId: string }>;
  searchParams: Promise<{ saved?: string; error?: string; respondent_added?: string }>;
}) {
  await requireRole(adminRoles);
  const [{ questionnaireId }, query] = await Promise.all([params, searchParams]);
  const supabase = await createClient();

  const [{ data: questionnaire }, { data: questions }, { data: respondents }, { data: departments }] =
    await Promise.all([
      supabase
        .from("questionnaires")
        .select("id,title,description,target_department_type")
        .eq("id", questionnaireId)
        .single(),
      supabase
        .from("questions")
        .select("id,question_text,help_text,is_required,sort_order")
        .eq("questionnaire_id", questionnaireId)
        .eq("is_active", true)
        .order("sort_order"),
      supabase
        .from("respondents")
        .select("id,full_name,designation,departments(name)")
        .eq("is_active", true)
        .order("full_name"),
      supabase
        .from("departments")
        .select("id,name")
        .eq("is_active", true)
        .order("name")
    ]);

  if (!questionnaire) notFound();

  const respondentOptions = (respondents ?? []) as unknown as RespondentOption[];
  const questionRows = (questions ?? []) as QuestionRow[];

  return (
    <>
      <PageHeader
        title={questionnaire.title}
        description="Ask these questions directly and type the answers during the meeting."
      />
      <div className="mb-5 flex flex-wrap gap-2">
        <Link
          href="/collect"
          className="inline-flex min-h-10 items-center gap-2 rounded-md border bg-card px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to questionnaire list
        </Link>
      </div>

      {query.saved ? (
        <div className="mb-5 rounded-md border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-900">
          Draft saved. You can continue later.
        </div>
      ) : null}
      {query.respondent_added ? (
        <div className="mb-5 rounded-md border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-900">
          Person added. Select them from the list and continue.
        </div>
      ) : null}
      {query.error === "missing_required" ? (
        <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Please answer all required questions before final submission.
        </div>
      ) : null}
      {query.error === "respondent_required" ? (
        <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Enter person name and either select or type a department before adding.
        </div>
      ) : null}
      {query.error === "file_invalid" ? (
        <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          File type or size is not allowed. Use PDF, image, Excel, or Word files up to 10MB.
        </div>
      ) : null}

      <section className="mb-5 rounded-lg border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-primary" />
          <div>
            <h2 className="text-base font-semibold">Person not in the list?</h2>
            <p className="text-sm text-muted-foreground">
              Add them here quickly, then select them below.
            </p>
          </div>
        </div>
        <form action={quickCreateRespondent} className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_1fr_auto] md:items-end">
          <input type="hidden" name="questionnaire_id" value={questionnaireId} />
          <Field label="Name">
            <Input name="full_name" placeholder="Responsible person name" />
          </Field>
          <Field label="Designation">
            <Input name="designation" placeholder="Manager, supervisor, etc." />
          </Field>
          <Field label="Department">
            <Select name="department_id">
              <option value="">Select department</option>
              {departments?.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Or type department">
            <Input name="department_name" placeholder="New department name" />
          </Field>
          <Button type="submit" variant="secondary">
            Add person
          </Button>
        </form>
      </section>

      <form action={collectAnswersDirectly} className="grid gap-4">
        <input type="hidden" name="questionnaire_id" value={questionnaireId} />
        <section className="rounded-lg border bg-card p-5 shadow-sm">
          <Field label="Person you are meeting">
            <Select name="respondent_id" required>
              <option value="">Select respondent</option>
              {respondentOptions.map((respondent) => (
                <option key={respondent.id} value={respondent.id}>
                  {respondent.full_name} - {respondent.departments?.[0]?.name ?? "No department"}
                </option>
              ))}
            </Select>
          </Field>
        </section>

        {questionRows.map((question, index) => (
          <section key={question.id} className="rounded-lg border bg-card p-5 shadow-sm">
            <label className="block">
              <p className="text-xs font-semibold uppercase text-primary">
                Question {index + 1}
                {question.is_required ? " | Required" : ""}
              </p>
              <p className="mt-2 text-base font-semibold leading-7">{question.question_text}</p>
              {question.help_text ? (
                <p className="mt-1 text-sm text-muted-foreground">{question.help_text}</p>
              ) : null}
              <Textarea
                name={`answer_${question.id}`}
                className="mt-4"
                placeholder="Type the answer here while speaking with the person"
              />
            </label>
          </section>
        ))}

        <section className="rounded-lg border bg-card p-5 shadow-sm">
          <h2 className="text-base font-semibold">Supporting documents</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Optional. Upload a paper form, photo, Excel, Word, or PDF collected from this person.
          </p>
          <div className="mt-4">
            <FileUploader name="supporting_file" />
          </div>
        </section>

        <div className="sticky bottom-0 -mx-4 border-t bg-white/95 px-4 py-3 backdrop-blur lg:-mx-8 lg:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button type="submit" name="intent" value="draft" variant="secondary">
              <Save className="mr-2 h-4 w-4" />
              Save draft
            </Button>
            <Button type="submit" name="intent" value="submit">
              Submit final answers
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
