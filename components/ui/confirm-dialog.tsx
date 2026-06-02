import { Button } from "@/components/ui/button";

export function ConfirmDialog({
  title,
  description,
  actionLabel
}: {
  title: string;
  description: string;
  actionLabel: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-5 shadow-sm">
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <div className="mt-4 flex justify-end gap-2">
        <Button type="button" variant="secondary">
          Cancel
        </Button>
        <Button type="submit">{actionLabel}</Button>
      </div>
    </div>
  );
}
