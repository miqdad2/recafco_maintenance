import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border bg-card p-6 text-center shadow-soft">
        <h1 className="text-2xl font-semibold">Unauthorized</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Your account does not have permission to access this area.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}
