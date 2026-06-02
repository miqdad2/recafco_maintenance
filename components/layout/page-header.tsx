import Link from "next/link";

export function PageHeader({
  title,
  description,
  action
}: {
  title: string;
  description?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal">{title}</h1>
        {description ? (
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action ? (
        <Link
          href={action.href}
          className="inline-flex min-h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
