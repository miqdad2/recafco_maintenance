import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable, Td } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/session";
import { dashboardRoles } from "@/lib/permissions/roles";

type SubmissionRow = {
  id: string;
  status: string;
  submitted_at: string | null;
  progress_percent: number;
  questionnaires: { title: string }[] | null;
  respondents: { full_name: string }[] | null;
  departments: { name: string }[] | null;
};

export default async function SubmissionsPage() {
  await requireRole(dashboardRoles);
  const supabase = await createClient();
  const { data } = await supabase
    .from("questionnaire_assignments")
    .select("id,status,submitted_at,progress_percent,questionnaires(title),respondents(full_name),departments(name)")
    .in("status", ["submitted", "reviewed", "approved", "reopened"])
    .order("submitted_at", { ascending: false, nullsFirst: false });

  const submissions = (data ?? []) as unknown as SubmissionRow[];

  return (
    <>
      <PageHeader
        title="Submissions"
        description="Review submitted and reopened respondent questionnaires."
      />
      {submissions.length ? (
        <DataTable headers={["Questionnaire", "Respondent", "Department", "Status", "Submitted"]}>
          {submissions.map((submission) => (
            <tr key={submission.id}>
              <Td>
                <Link href={`/submissions/${submission.id}`} className="font-medium text-primary">
                  {submission.questionnaires?.[0]?.title ?? "-"}
                </Link>
              </Td>
              <Td>{submission.respondents?.[0]?.full_name ?? "-"}</Td>
              <Td>{submission.departments?.[0]?.name ?? "-"}</Td>
              <Td>
                <StatusBadge active label={submission.status} />
                <p className="mt-1 text-xs text-muted-foreground">
                  {submission.progress_percent}% complete
                </p>
              </Td>
              <Td>
                {submission.submitted_at
                  ? new Date(submission.submitted_at).toLocaleString()
                  : "-"}
              </Td>
            </tr>
          ))}
        </DataTable>
      ) : (
        <EmptyState
          title="No submissions yet"
          description="Submitted questionnaires will appear here for review."
        />
      )}
    </>
  );
}
