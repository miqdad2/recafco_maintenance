import Link from "next/link";
import {
  ClipboardList,
  Gauge,
  LogOut,
  Settings,
  UsersRound,
  Building2,
  Send,
  FileCheck2,
  Network,
  PanelsTopLeft,
  ClipboardCheck
} from "lucide-react";
import { logout } from "./actions";
import { requireUser } from "@/lib/auth/session";
import { roleLabel } from "@/lib/permissions/roles";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/system-map", label: "System Map", icon: Network },
  { href: "/prototype", label: "Prototype", icon: PanelsTopLeft },
  { href: "/departments", label: "Departments", icon: Building2 },
  { href: "/respondents", label: "Respondents", icon: UsersRound },
  { href: "/questionnaires", label: "Questionnaires", icon: ClipboardList },
  { href: "/assignments", label: "Send Questions", icon: Send },
  { href: "/collect", label: "Collect Answers", icon: ClipboardCheck },
  { href: "/submissions", label: "Submissions", icon: FileCheck2 },
  { href: "/settings", label: "Settings", icon: Settings }
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const currentUser = await requireUser();

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-card p-4 lg:block">
        <div className="px-2 py-3">
          <p className="text-xs font-semibold uppercase text-primary">RECAFCO</p>
          <p className="mt-1 text-lg font-semibold">Requirement Portal</p>
        </div>
        <nav className="mt-6 grid gap-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-slate-700 hover:bg-muted"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b bg-white/95 px-4 py-3 backdrop-blur lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{currentUser.profile.full_name}</p>
              <p className="text-xs text-muted-foreground">
                {roleLabel(currentUser.profile.role)}
              </p>
            </div>
            <form action={logout}>
              <button
                className="inline-flex min-h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium hover:bg-muted"
                type="submit"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </form>
          </div>
        </header>
        <main className="px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
