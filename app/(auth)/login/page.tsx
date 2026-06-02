import { login } from "./actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <form
        action={login}
        className="w-full max-w-md rounded-lg border bg-card p-6 shadow-soft"
      >
        <div className="mb-6">
          <p className="text-sm font-semibold text-primary">RECAFCO</p>
          <h1 className="mt-2 text-2xl font-semibold">Requirement Portal Login</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in with your admin username and password.
          </p>
        </div>
        {params.error ? (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {params.error}
          </div>
        ) : null}
        <input type="hidden" name="next" value={params.next ?? "/dashboard"} />
        <div className="grid gap-4">
          <label className="grid gap-1.5 text-sm font-medium">
            Username
            <Input name="username" autoComplete="username" required />
          </label>
          <label className="grid gap-1.5 text-sm font-medium">
            Password
            <Input name="password" type="password" autoComplete="current-password" required />
          </label>
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </div>
      </form>
    </main>
  );
}
