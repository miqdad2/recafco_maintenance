import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { requestPasswordReset } from "./reset-action";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <form action={requestPasswordReset} className="w-full max-w-md rounded-lg border bg-card p-6 shadow-soft">
        <h1 className="text-2xl font-semibold">Forgot Password</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your email and Supabase will send a reset link if the account exists.
        </p>
        <label className="mt-6 grid gap-1.5 text-sm font-medium">
          Email
          <Input name="email" type="email" required />
        </label>
        <Button type="submit" className="mt-4 w-full">
          Send reset link
        </Button>
      </form>
    </main>
  );
}
