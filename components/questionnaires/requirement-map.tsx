import {
  ClipboardCheck,
  GitBranch,
  Lightbulb,
  ListChecks
} from "lucide-react";
import { groupQuestionsByImpact } from "@/lib/requirements/question-impact";

type RequirementMapQuestion = {
  id: string;
  question_text: string;
};

export function RequirementMap({
  questionnaireTitle,
  questions
}: {
  questionnaireTitle: string;
  questions: RequirementMapQuestion[];
}) {
  const groups = groupQuestionsByImpact(questions);
  const questionNumber = new Map(
    questions.map((question, index) => [question.id, index + 1])
  );

  return (
    <div className="grid gap-5">
      <section className="rounded-lg border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-teal-50 text-primary">
            <GitBranch className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-primary">Requirement Map</p>
            <h2 className="mt-1 text-xl font-semibold">{questionnaireTitle}</h2>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
              This view connects each question to the part of the future maintenance
              system it helps define.
            </p>
          </div>
        </div>
      </section>

      <section className="overflow-x-auto rounded-lg border bg-white p-5 shadow-sm">
        <div className="min-w-[980px]">
          <div className="mx-auto mb-8 max-w-xl rounded-lg border-2 border-primary bg-teal-50 p-5 text-center">
            <p className="text-xs font-semibold uppercase text-primary">Central Requirement</p>
            <h3 className="mt-1 text-xl font-semibold">{questionnaireTitle}</h3>
            <p className="mt-2 text-sm text-teal-900">
              All answers together define the system scope, workflow, security,
              reports, and implementation plan.
            </p>
          </div>

          <div className="relative mx-auto mb-8 h-8 w-px bg-border" />

          <div className="grid gap-6">
          {groups.map((group) => (
              <div key={group.impact.area} className="grid grid-cols-[260px_40px_1fr] items-start gap-0">
                <div className="rounded-lg border bg-card p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-primary">
                    <ClipboardCheck className="h-5 w-5" />
                    <h3 className="font-semibold">{group.impact.area}</h3>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{group.impact.purpose}</p>
                  <div className="mt-4 rounded-md bg-teal-50 p-3 text-sm text-teal-900">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0" />
                      <p>{group.impact.systemOutput}</p>
                    </div>
                  </div>
                </div>

                <div className="flex h-full items-start justify-center pt-8">
                  <div className="h-px w-full bg-border" />
                </div>

                <div className="grid gap-3 rounded-lg border border-dashed bg-slate-50 p-4">
                  {group.questions.map((question, index) => (
                    <div key={question.id} className="rounded-md border bg-white p-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                          {questionNumber.get(question.id) ?? index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium leading-6">{question.question_text}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            This answer helps define: {group.impact.systemOutput}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
          ))}
          </div>
        </div>
      </section>

      <section className="rounded-lg border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <ListChecks className="h-5 w-5 text-primary" />
          <h3 className="text-base font-semibold">How admin should use this</h3>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          After answers are submitted, review each area and convert unclear answers into
          follow-up questions before preparing the SRS.
        </p>
      </section>
    </div>
  );
}
