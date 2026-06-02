import { cn } from "@/lib/utils";

export function StatusBadge({
  active,
  label
}: {
  active?: boolean;
  label?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
        active
          ? "bg-emerald-100 text-emerald-800"
          : "bg-slate-200 text-slate-700"
      )}
    >
      {label ?? (active ? "Active" : "Inactive")}
    </span>
  );
}
