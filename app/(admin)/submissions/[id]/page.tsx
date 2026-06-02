import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable, Td } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/session";
import { adminRoles, dashboardRoles } from "@/lib/permissions/roles";
import { reopenSubmission } from "../../actions";

type AssignmentDetail = {
  id: string;
  status: string;
  submitted_at: string | null;
  progress_percent: number;
  questionnaires: { title: string; description: string | null } | null;
  respondents: { full_name: string; designation: string | null; email: string | null } | null;
  departments: { name: string } | null;
};

type AnswerDetail = {
  id: string;
  answer_text: string | null;
  status: string;
  review_comment: string | null;
  questions: { question_text: string } | null;
};

type FileDetail = {
  id: string;
  file_name: string;
  file_type: string | null;
  file_size: number | null;
  file_path: string;
  created_at: string;
};

export default async function SubmissionDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const currentUser = await requireRole(dashboardRoles);
  const canManage = adminRoles.includes(currentUser.profile.role);
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: assignmentData }, { data: answersData }, { data: files }] =
    await Promise.all([
      supabase
        .from("questionnaire_assignments")
        .select("id,status,submitted_at,progress_percent,questionnaires(title,description),respondents(full_name,designation,email),departments(name)")
        .eq("id", id)
        .single(),
      supabase
        .from("answers")
        .select("id,answer_text,status,review_comment,questions(question_text)")
        .eq("assignment_id", id)
        .order("created_at"),
      supabase
        .from("answer_files")
        .select("id,file_name,file_type,file_size,file_path,created_at")
        .eq("assignment_id", id)
        .order("created_at", { ascending: false })
    ]);

  if (!assignmentData) notFound();

  const assignment = assignmentData as unknown as AssignmentDetail;
  const answers = (answersData ?? []) as unknown as AnswerDetail[];
  const uploadedFiles = (files ?? []) as FileDetail[];
  const canReopen = ["submitted", "reviewed", "approved"].includes(assignment.status);

  const fileLinks = await Promise.all(
    uploadedFiles.map(async (file) => {
      const { data } = await supabase.storage
        .from("requirement-files")
        .createSignedUrl(file.file_path, 60 * 10);

      return {
        ...file,
        signedUrl: data?.signedUrl ?? null
      };
    })
  );

  return (
    <>
      <PageHeader
        title={assignment.questionnaires?.title ?? "Submission"}
        description={assignment.questionnaires?.description ?? undefined}
      />
      <section className="mb-6 rounded-lg border bg-card p-5 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-4">
          <div>
            <p className="text-xs uppercase text-muted-foreground">Respondent</p>
            <p className="mt-1 font-medium">{assignment.respondents?.full_name ?? "-"}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-muted-foreground">Department</p>
            <p className="mt-1 font-medium">{assignment.departments?.name ?? "-"}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-muted-foreground">Status</p>
            <p className="mt-1">
              <StatusBadge active label={assignment.status} />
            </p>
          </div>
          <div>
            <p className="text-xs uppercase text-muted-foreground">Progress</p>
            <p className="mt-1 font-medium">{assignment.progress_percent}%</p>
          </div>
        </div>
        {canManage && canReopen ? (
          <form action={reopenSubmission} className="mt-4">
            <input type="hidden" name="assignment_id" value={assignment.id} />
            <Button type="submit" variant="secondary">
              Reopen submission
            </Button>
          </form>
        ) : null}
      </section>

      <section className="mb-8">
        <PageHeader title="Answers" />
        {answers.length ? (
          <DataTable headers={["Question", "Answer", "Status", "Review Comment"]}>
            {answers.map((answer) => (
              <tr key={answer.id}>
                <Td className="font-medium">{answer.questions?.question_text ?? "-"}</Td>
                <Td>{answer.answer_text ?? "-"}</Td>
                <Td>
                  <StatusBadge active label={answer.status} />
                </Td>
                <Td>{answer.review_comment ?? "-"}</Td>
              </tr>
            ))}
          </DataTable>
        ) : (
          <EmptyState
            title="No answers saved"
            description="Draft or submitted answers will appear here."
          />
        )}
      </section>

      <section>
        <PageHeader title="Uploaded Files" />
        {fileLinks.length ? (
          <DataTable headers={["File", "Type", "Size", "Uploaded", "Action"]}>
            {fileLinks.map((file) => (
              <tr key={file.id}>
                <Td className="font-medium">{file.file_name}</Td>
                <Td>{file.file_type ?? "-"}</Td>
                <Td>{file.file_size ? `${Math.round(file.file_size / 1024)} KB` : "-"}</Td>
                <Td>{new Date(file.created_at).toLocaleString()}</Td>
                <Td>
                  {file.signedUrl ? (
                    <a
                      href={file.signedUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-10 items-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
                    >
                      Open file
                    </a>
                  ) : (
                    "-"
                  )}
                </Td>
              </tr>
            ))}
          </DataTable>
        ) : (
          <EmptyState
            title="No files uploaded"
            description="Assignment-level uploads from the secure link will appear here."
          />
        )}
      </section>
    </>
  );
}
