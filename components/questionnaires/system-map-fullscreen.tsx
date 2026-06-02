import { ClipboardList, Network } from "lucide-react";
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
  target_department_type: string | null;
};

export function SystemMapFullscreen({
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
    <main className="h-screen overflow-hidden bg-slate-50 p-3 text-slate-950">
      <section className="flex h-full flex-col rounded-lg border bg-white p-3 shadow-sm">
        <header className="relative mb-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-teal-50 text-primary">
              <Network className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase text-primary">Full Screen System Map</p>
              <h1 className="text-lg font-semibold">RECAFCO Maintenance Requirements</h1>
            </div>
          </div>
          <div className="rounded-lg border-2 border-primary bg-teal-50 px-6 py-3 text-center">
            <p className="text-[10px] font-semibold uppercase text-primary">Future System</p>
            <p className="text-base font-semibold">Maintenance Management System</p>
          </div>
          <div className="text-right text-xs">
            <p className="font-semibold">{questionnaires.length} questionnaires</p>
            <p className="text-muted-foreground">{questions.length} total questions</p>
          </div>
        </header>

        <div className="relative min-h-0 flex-1">
          <div className="pointer-events-none absolute inset-x-[9.5%] top-4 z-0 border-t-2 border-dotted border-teal-300" />
          <div className="pointer-events-none absolute inset-x-[9.5%] top-[calc(50%+1rem)] z-0 border-t-2 border-dotted border-teal-300" />
          <div className="pointer-events-none absolute left-1/2 top-[-0.75rem] z-0 h-[calc(50%+1.75rem)] border-l-2 border-dotted border-teal-300" />
          <div className="relative z-10 grid h-full grid-cols-5 grid-rows-2 gap-2">
          {questionnaires.map((questionnaire, questionnaireIndex) => {
            const questionnaireQuestions =
              questionsByQuestionnaire.get(questionnaire.id)?.sort(
                (a, b) => a.sort_order - b.sort_order
              ) ?? [];

            return (
              <section
                key={questionnaire.id}
                className="relative min-h-0 overflow-hidden rounded-md border bg-card p-2 shadow-sm"
              >
                <div className="absolute left-1/2 top-0 h-3 border-l-2 border-dotted border-teal-300" />
                <div className="absolute left-1/2 top-3 h-2 w-2 -translate-x-1/2 rounded-full bg-primary" />
                <div className="mb-1 flex items-start gap-2">
                  <ClipboardList className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <h2 className="truncate text-[13px] font-semibold" title={questionnaire.title}>
                      {questionnaire.title}
                    </h2>
                    <p className="text-[10px] text-muted-foreground">
                      {questionnaire.target_department_type ?? "General"} | {questionnaireQuestions.length} questions
                    </p>
                  </div>
                </div>

                <div className="grid gap-1">
                  {questionnaireQuestions.map((question, questionIndex) => {
                    const impact = getQuestionImpact(question.question_text);

                    return (
                      <div
                        key={question.id}
                        title={`${question.question_text}\n\nHelps define: ${impact.systemOutput}`}
                        className="rounded border bg-slate-50 px-1.5 py-1"
                      >
                        <div className="flex items-start gap-1.5">
                          <span className="mt-0.5 flex h-4 w-7 shrink-0 items-center justify-center rounded bg-teal-100 text-[9px] font-semibold text-teal-900">
                            {questionnaireIndex + 1}.{questionIndex + 1}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-[10px] font-medium">
                              {question.question_text}
                            </p>
                            <p className="truncate text-[9px] text-muted-foreground">
                              {impact.area}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
          </div>
        </div>
      </section>
    </main>
  );
}
