import { AlertCircle, CheckCircle2, Lock } from "lucide-react";
import { saveTokenQuestionnaire } from "./actions";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { FileUploader } from "@/components/files/file-uploader";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateTokenAssignment } from "@/lib/token-access";

export const dynamic = "force-dynamic";

type QuestionRow = {
  id: string;
  question_text: string;
  help_text: string | null;
  question_type: string;
  options: unknown;
  is_required: boolean;
  sort_order: number;
};

type AnswerRow = {
  question_id: string;
  answer_text: string | null;
};

function StateNotice({ state }: { state?: string }) {
  const messages: Record<string, string> = {
    saved: "Draft saved. You can continue later using this same link.",
    submitted: "Your questionnaire has been submitted.",
    missing_required: "Please answer all required questions before final submission.",
    file_invalid: "The uploaded file type or size is not allowed."
  };

  if (!state || !messages[state]) return null;

  return (
    <div className="mb-5 rounded-md border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800">
      {messages[state]}
    </div>
  );
}

function LinkProblem({
  title,
  description,
  icon
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg rounded-lg border bg-card p-6 text-center shadow-soft">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          {icon}
        </div>
        <h1 className="mt-4 text-2xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
    </main>
  );
}

function renderQuestion(question: QuestionRow, value: string) {
  const name = `answer_${question.id}`;
  const commonClass = "mt-1";

  if (question.question_type === "long_text") {
    return (
      <Textarea
        className={commonClass}
        name={name}
        defaultValue={value}
        placeholder="Type your answer here"
      />
    );
  }

  if (question.question_type === "yes_no") {
    return (
      <Select className={commonClass} name={name} defaultValue={value}>
        <option value="">Select answer</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    );
  }

  if (question.question_type === "number") {
    return <Input className={commonClass} name={name} type="number" defaultValue={value} />;
  }

  if (question.question_type === "date") {
    return <Input className={commonClass} name={name} type="date" defaultValue={value} />;
  }

  return (
    <Input
      className={commonClass}
      name={name}
      defaultValue={value}
      placeholder="Type your answer here"
    />
  );
}

export default async function SecureQuestionnairePage({
  params,
  searchParams
}: {
  params: Promise<{ secureToken: string }>;
  searchParams: Promise<{ state?: string }>;
}) {
  const [{ secureToken }, query] = await Promise.all([params, searchParams]);
  const validation = await validateTokenAssignment(secureToken);

  if (!validation.ok) {
    const isExpired = validation.reason === "expired";
    return (
      <LinkProblem
        title={isExpired ? "This link has expired" : "Invalid questionnaire link"}
        description={
          isExpired
            ? "Please contact RECAFCO IT or the requirement collection team for a new link."
            : "This questionnaire link is not valid or is no longer active."
        }
        icon={<AlertCircle className="h-6 w-6 text-destructive" />}
      />
    );
  }

  const assignment = validation.assignment;
  const isLocked =
    ["submitted", "reviewed", "approved"].includes(assignment.status) &&
    assignment.status !== "reopened";

  if (isLocked) {
    return (
      <LinkProblem
        title="Submission received"
        description="This questionnaire has already been submitted. It can only be edited if an admin reopens it."
        icon={<Lock className="h-6 w-6 text-primary" />}
      />
    );
  }

  const supabase = createAdminClient();
  await supabase.from("audit_logs").insert({
    user_id: null,
    action: "questionnaire_opened_by_token",
    entity_type: "questionnaire_assignments",
    entity_id: assignment.id
  });

  const [{ data: questions }, { data: answers }] = await Promise.all([
    supabase
      .from("questions")
      .select("id,question_text,help_text,question_type,options,is_required,sort_order")
      .eq("questionnaire_id", assignment.questionnaire_id)
      .eq("is_active", true)
      .order("sort_order"),
    supabase
      .from("answers")
      .select("question_id,answer_text")
      .eq("assignment_id", assignment.id)
  ]);

  const answerMap = new Map(
    ((answers ?? []) as AnswerRow[]).map((answer) => [
      answer.question_id,
      answer.answer_text ?? ""
    ])
  );

  return (
    <main className="min-h-screen bg-background px-4 py-6">
      <div className="mx-auto max-w-3xl">
        <header className="mb-5 rounded-lg border bg-card p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase text-primary">RECAFCO Requirement Collection</p>
          <h1 className="mt-2 text-2xl font-semibold">
            {assignment.questionnaires?.title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            No login is required. Answer what you know, save draft if needed, and submit when finished.
          </p>
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase text-muted-foreground">Respondent</p>
              <p className="font-medium">{assignment.respondents?.full_name}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">Department</p>
              <p className="font-medium">{assignment.departments?.name}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">Status</p>
              <StatusBadge active label={assignment.status} />
            </div>
          </div>
          <div className="mt-4">
            <ProgressBar value={assignment.progress_percent} />
          </div>
        </header>

        <StateNotice state={query.state} />

        {query.state === "submitted" ? (
          <div className="mb-5 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <CheckCircle2 className="mr-2 inline h-4 w-4" />
            Final submission completed.
          </div>
        ) : null}

        <form action={saveTokenQuestionnaire} className="grid gap-4">
          <input type="hidden" name="secure_token" value={secureToken} />
          {((questions ?? []) as QuestionRow[]).map((question, index) => (
            <section key={question.id} className="rounded-lg border bg-card p-5 shadow-sm">
              <label className="block text-sm font-medium">
                <span className="text-xs text-muted-foreground">Question {index + 1}</span>
                <span className="mt-1 block text-base leading-6">
                  {question.question_text}
                  {question.is_required ? <span className="text-destructive"> *</span> : null}
                </span>
                {question.help_text ? (
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {question.help_text}
                  </span>
                ) : null}
                {renderQuestion(question, answerMap.get(question.id) ?? "")}
              </label>
            </section>
          ))}

          <section className="rounded-lg border bg-card p-5 shadow-sm">
            <h2 className="text-sm font-semibold">Supporting File</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Optional. Attach one PDF, image, Excel, or Word file if it helps explain your answer.
            </p>
            <div className="mt-4">
              <FileUploader name="assignment_file" />
            </div>
          </section>

          <div className="sticky bottom-0 -mx-4 border-t bg-white/95 px-4 py-3 backdrop-blur">
            <div className="mx-auto flex max-w-3xl flex-col gap-2 sm:flex-row sm:justify-end">
              <Button type="submit" name="intent" value="draft" variant="secondary">
                Save draft
              </Button>
              <Button type="submit" name="intent" value="submit">
                Submit final answers
              </Button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
