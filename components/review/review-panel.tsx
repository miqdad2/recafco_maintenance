import { StatusBadge } from "@/components/ui/status-badge";

export function ReviewPanel({
  status,
  comment
}: {
  status: string;
  comment?: string | null;
}) {
  return (
    <aside className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold">Review</h2>
        <StatusBadge active={status === "approved" || status === "clear"} label={status} />
      </div>
      {comment ? <p className="mt-3 text-sm text-muted-foreground">{comment}</p> : null}
    </aside>
  );
}
