import { ClipboardList, Lightbulb, Network, Route } from "lucide-react";
import { getQuestionImpact } from "@/lib/requirements/question-impact";

type SystemQuestion = {
  id: string;
  questionnaire_id: string;
  question_text: string;
  sort_order: number;
};

type SystemQuestionnaire = {
  id: string;
  title: string;
  description: string | null;
  target_department_type: string | null;
  status: string;
};

export function SystemRequirementMap({
  questionnaires,
  questions
}: {
  questionnaires: SystemQuestionnaire[];
  questions: SystemQuestion[];
}) {
  const questionsByQuestionnaire = new Map<string, SystemQuestion[]>();

  for (const question of questions) {
    const list = questionsByQuestionnaire.get(question.questionnaire_id) ?? [];
    list.push(question);
    questionsByQuestionnaire.set(question.questionnaire_id, list);
  }

  return (
    <div className="grid gap-5">
      <section className="rounded-lg border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-teal-50 text-primary">
              <Network className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-primary">Whole System Map</p>
              <h2 className="mt-1 text-xl font-semibold">
                RECAFCO Maintenance System Requirements
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
                This page shows all questionnaires and all questions in one visual
                structure, so admin can see what information is being collected before
                system design starts.
              </p>
            </div>
          </div>
          <div className="rounded-md border bg-muted/40 px-4 py-3 text-sm">
            <p className="font-semibold">{questionnaires.length} questionnaires</p>
            <p className="text-muted-foreground">{questions.length} total questions</p>
          </div>
        </div>
      </section>

      <section className="overflow-x-auto rounded-lg border bg-white p-5 shadow-sm">
        <div className="min-w-[1120px]">
          <div className="mx-auto mb-8 max-w-2xl rounded-lg border-2 border-primary bg-teal-50 p-5 text-center">
            <p className="text-xs font-semibold uppercase text-primary">Central System</p>
            <h3 className="mt-1 text-xl font-semibold">Future Maintenance Management System</h3>
            <p className="mt-2 text-sm text-teal-900">
              Department answers define modules, workflows, roles, approvals, reports,
              security, integrations, and rollout priorities.
            </p>
          </div>

          <div className="relative mx-auto mb-8 h-8 w-px bg-border" />

          <div className="grid gap-6">
            {questionnaires.map((questionnaire, questionnaireIndex) => {
              const questionnaireQuestions =
                questionsByQuestionnaire.get(questionnaire.id)?.sort(
                  (a, b) => a.sort_order - b.sort_order
                ) ?? [];
              const impactAreas = Array.from(
                new Set(
                  questionnaireQuestions.map(
                    (question) => getQuestionImpact(question.question_text).area
                  )
                )
              );

              return (
                <div
                  key={questionnaire.id}
                  className="grid grid-cols-[300px_44px_1fr] items-start"
                >
                  <div className="rounded-lg border bg-card p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-primary">
                      <ClipboardList className="h-5 w-5" />
                      <h3 className="font-semibold">{questionnaire.title}</h3>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {questionnaire.description ?? "Requirement questionnaire"}
                    </p>
                    <div className="mt-4 grid gap-2 text-xs">
                      <div className="rounded-md bg-muted px-3 py-2">
                        Department: {questionnaire.target_department_type ?? "General"}
                      </div>
                      <div className="rounded-md bg-muted px-3 py-2">
                        Questions: {questionnaireQuestions.length}
                      </div>
                    </div>
                  </div>

                  <div className="flex h-full items-start justify-center pt-8">
                    <div className="h-px w-full bg-border" />
                  </div>

                  <div className="rounded-lg border border-dashed bg-slate-50 p-4">
                    <div className="mb-4 flex flex-wrap gap-2">
                      {impactAreas.map((area) => (
                        <span
                          key={area}
                          className="inline-flex rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-900"
                        >
                          {area}
                        </span>
                      ))}
                    </div>

                    <div className="grid gap-3">
                      {questionnaireQuestions.map((question, questionIndex) => {
                        const impact = getQuestionImpact(question.question_text);
                        return (
                          <div key={question.id} className="rounded-md border bg-white p-3">
                            <div className="flex items-start gap-3">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                                {questionnaireIndex + 1}.{questionIndex + 1}
                              </div>
                              <div>
                                <p className="text-sm font-medium leading-6">
                                  {question.question_text}
                                </p>
                                <div className="mt-2 grid gap-2 text-xs text-muted-foreground lg:grid-cols-[180px_1fr]">
                                  <div className="flex items-center gap-2 rounded-md bg-slate-100 px-2 py-1">
                                    <Route className="h-3.5 w-3.5 text-primary" />
                                    {impact.area}
                                  </div>
                                  <div className="flex items-start gap-2 rounded-md bg-teal-50 px-2 py-1 text-teal-900">
                                    <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                    {impact.systemOutput}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
