import { updatePassword } from "./update-action";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <form action={updatePassword} className="w-full max-w-md rounded-lg border bg-card p-6 shadow-soft">
        <h1 className="text-2xl font-semibold">Reset Password</h1>
        <label className="mt-6 grid gap-1.5 text-sm font-medium">
          New password
          <Input name="password" type="password" minLength={8} required />
        </label>
        <Button type="submit" className="mt-4 w-full">
          Update password
        </Button>
      </form>
    </main>
  );
}
