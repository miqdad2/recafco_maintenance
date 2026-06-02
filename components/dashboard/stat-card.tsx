import type { LucideIcon } from "lucide-react";

export function StatCard({
  title,
  value,
  icon: Icon
}: {
  title: string;
  value: number;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-lg border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-semibold">{value}</p>
        </div>
        <div className="rounded-md bg-teal-50 p-3 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
