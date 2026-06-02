import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable, Td } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { CopyLinkButton } from "@/components/assignments/copy-link-button";
import { DeleteAssignmentButton } from "@/components/assignments/delete-assignment-button";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/session";
import { dashboardRoles } from "@/lib/permissions/roles";
import { buildQuestionnaireLink } from "@/lib/secure-tokens";
import { regenerateAssignmentToken, reopenSubmission } from "../actions";
import { adminRoles } from "@/lib/permissions/roles";

type AssignmentRow = {
  id: string;
  status: string;
  secure_token: string | null;
  token_expires_at: string | null;
  due_date: string | null;
  submitted_at: string | null;
  progress_percent: number;
  questionnaires: { title: string }[] | null;
  respondents: { full_name: string; email: string | null }[] | null;
  departments: { name: string }[] | null;
};

export default async function AssignmentsPage() {
  const currentUser = await requireRole(dashboardRoles);
  const canManage = adminRoles.includes(currentUser.profile.role);
  const supabase = await createClient();
  const { data } = await supabase
    .from("questionnaire_assignments")
    .select("id,status,secure_token,token_expires_at,due_date,submitted_at,progress_percent,questionnaires(title),respondents(full_name,email),departments(name)")
    .neq("status", "expired")
    .order("created_at", { ascending: false });

  const assignments = (data ?? []) as unknown as AssignmentRow[];

  return (
    <>
      <PageHeader
        title="Send Questions"
        description="Send a secure link, or open the form yourself and enter answers during a meeting."
        action={canManage ? { href: "/assignments/new", label: "Create link" } : undefined}
      />
      <section className="mb-5 grid gap-3 rounded-lg border bg-card p-4 text-sm shadow-sm md:grid-cols-2">
        <div className="rounded-md bg-teal-50 p-3 text-teal-900">
          <p className="font-semibold">Option 1: Send link</p>
          <p className="mt-1">Copy the secure link and send it to the respondent. They answer without login.</p>
        </div>
        <div className="rounded-md bg-slate-50 p-3">
          <p className="font-semibold">Option 2: Collect in person</p>
          <p className="mt-1 text-muted-foreground">Open Collect Answers and enter answers while meeting them.</p>
          <Link href="/collect" className="mt-3 inline-flex text-sm font-semibold text-primary">
            Go to Collect Answers
          </Link>
        </div>
      </section>
      {assignments.length ? (
        <DataTable headers={["Assignment", "Respondent", "Status", "Token", "Actions"]}>
          {assignments.map((assignment) => {
            const link = assignment.secure_token
              ? buildQuestionnaireLink(assignment.secure_token)
              : "";
            const assignmentLabel = assignment.questionnaires?.[0]?.title ?? "this question link";
            const canReopen = ["submitted", "reviewed", "approved"].includes(assignment.status);
            return (
              <tr key={assignment.id}>
                <Td>
                  <p className="font-medium">{assignment.questionnaires?.[0]?.title ?? "-"}</p>
                  <p className="text-xs text-muted-foreground">
                    {assignment.departments?.[0]?.name ?? "-"} | Due {assignment.due_date ?? "-"}
                  </p>
                </Td>
                <Td>
                  <p>{assignment.respondents?.[0]?.full_name ?? "-"}</p>
                  <p className="text-xs text-muted-foreground">
                    {assignment.respondents?.[0]?.email ?? "No email"}
                  </p>
                </Td>
                <Td>
                  <StatusBadge
                    active={assignment.status !== "expired"}
                    label={assignment.status}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {assignment.progress_percent}% complete
                  </p>
                </Td>
                <Td>
                  <p className="max-w-[220px] truncate text-xs">{link || "No token"}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Expires {assignment.token_expires_at ? new Date(assignment.token_expires_at).toLocaleDateString() : "-"}
                  </p>
                </Td>
                <Td>
                  <div className="flex flex-wrap gap-2">
                    {link ? <CopyLinkButton link={link} /> : null}
                    {link ? (
                      <Link
                        href={link}
                        target="_blank"
                        className="inline-flex min-h-10 items-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground"
                      >
                        Open form
                      </Link>
                    ) : null}
                    {canManage ? (
                      <form action={regenerateAssignmentToken}>
                        <input type="hidden" name="assignment_id" value={assignment.id} />
                        <Button type="submit" variant="secondary">
                          Regenerate
                        </Button>
                      </form>
                    ) : null}
                    {canManage && canReopen ? (
                      <form action={reopenSubmission}>
                        <input type="hidden" name="assignment_id" value={assignment.id} />
                        <Button type="submit" variant="secondary">
                          Reopen
                        </Button>
                      </form>
                    ) : null}
                    {canManage ? (
                      <DeleteAssignmentButton
                        assignmentId={assignment.id}
                        label={assignmentLabel}
                      />
                    ) : null}
                    <Link
                      href={`/submissions/${assignment.id}`}
                      className="inline-flex min-h-10 items-center rounded-md border px-3 text-sm font-medium hover:bg-muted"
                    >
                      View
                    </Link>
                  </div>
                </Td>
              </tr>
            );
          })}
        </DataTable>
      ) : (
        <EmptyState
          title="No question links found"
          description="Create a link to send questions to a respondent."
        />
      )}
    </>
  );
}
