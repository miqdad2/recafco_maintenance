import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardList,
  Eye,
  FileText,
  HardHat,
  Laptop,
  LayoutDashboard,
  PackageCheck,
  ShieldCheck,
  Smartphone,
  UsersRound,
  Wrench
} from "lucide-react";

type PrototypeStats = {
  questionnaires: number;
  questions: number;
  departments: number;
  respondents: number;
};

const simpleFlow = [
  {
    title: "1. Department raises request",
    text: "A department reports a maintenance problem instead of sending paper or WhatsApp messages.",
    icon: Building2
  },
  {
    title: "2. Maintenance reviews it",
    text: "Maintenance decides priority, work type, section, and whether approval is needed.",
    icon: Wrench
  },
  {
    title: "3. Technician does the work",
    text: "Technician receives the job, updates progress, records time, materials, and photos.",
    icon: HardHat
  },
  {
    title: "4. Store / purchase / finance support",
    text: "Parts, purchase requests, cost approval, and stock movement are connected to the job.",
    icon: PackageCheck
  },
  {
    title: "5. Management sees result",
    text: "CEO and managers see status, delay, cost, downtime, and monthly summary reports.",
    icon: Eye
  }
];

const roleViews = [
  {
    title: "IT Manager",
    icon: ShieldCheck,
    sees: "Users, roles, hosting, backups, security, audit logs, access rules",
    decision: "Where the system will run and how secure it must be"
  },
  {
    title: "CEO / Management",
    icon: UsersRound,
    sees: "High-level dashboard, approvals, cost, overdue jobs, downtime, department comparison",
    decision: "Which KPIs and approvals are important"
  },
  {
    title: "Maintenance Manager",
    icon: Wrench,
    sees: "All work orders, priorities, approvals, technician assignment, completion status",
    decision: "How maintenance workflow should actually run"
  },
  {
    title: "Technician",
    icon: Smartphone,
    sees: "Only assigned jobs, mobile updates, start/end time, photos, parts request",
    decision: "What technicians can update from mobile"
  },
  {
    title: "Store / Purchase / Finance",
    icon: PackageCheck,
    sees: "Parts request, stock issue, purchase status, cost approval, price visibility",
    decision: "How parts and cost should connect to maintenance"
  },
  {
    title: "Department Requester",
    icon: Laptop,
    sees: "Submit request, track status, confirm completion, receive notification",
    decision: "Who can request maintenance and approve from each department"
  }
];

const decisions = [
  "Who can create a work order?",
  "Who approves before work starts?",
  "Can emergency work start without approval?",
  "Who assigns technicians?",
  "Should technicians update from mobile?",
  "How are parts requested and issued?",
  "Who can see cost and prices?",
  "What dashboards should CEO and management see?",
  "Should the system be inside company network only?",
  "What reports are needed for monthly review?"
];

const visualScreens = [
  {
    title: "Department Request",
    icon: Laptop,
    lines: ["Problem details", "Machine / location", "Priority", "Attachments"],
    footer: "Requester"
  },
  {
    title: "Maintenance Work Order",
    icon: Wrench,
    lines: ["Approve request", "Assign technician", "Track status", "Close job"],
    footer: "Maintenance"
  },
  {
    title: "Technician Mobile",
    icon: Smartphone,
    lines: ["My assigned jobs", "Start / finish time", "Material used", "Repair photos"],
    footer: "Technician"
  },
  {
    title: "Parts and Cost",
    icon: PackageCheck,
    lines: ["Parts request", "Stock issue", "Purchase request", "Finance approval"],
    footer: "Store / Finance"
  },
  {
    title: "Management Dashboard",
    icon: LayoutDashboard,
    lines: ["Overdue jobs", "Downtime", "Monthly cost", "Department comparison"],
    footer: "CEO / Management"
  }
];

export function SystemPrototype({ stats }: { stats: PrototypeStats }) {
  return (
    <div className="grid gap-6">
      <section className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <div>
            <p className="text-xs font-semibold uppercase text-primary">Simple Prototype Explanation</p>
            <h2 className="mt-2 text-3xl font-semibold">
              From paper maintenance work to one controlled digital system
            </h2>
            <p className="mt-4 max-w-4xl text-base leading-7 text-muted-foreground">
              This prototype is not the final design. It is a simple picture of what
              the future maintenance system can do after we collect answers from IT,
              maintenance, store, purchase, finance, departments, and management.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-md border bg-muted/40 p-3">
              <p className="text-muted-foreground">Questionnaires</p>
              <p className="mt-1 text-2xl font-semibold">{stats.questionnaires}</p>
            </div>
            <div className="rounded-md border bg-muted/40 p-3">
              <p className="text-muted-foreground">Questions</p>
              <p className="mt-1 text-2xl font-semibold">{stats.questions}</p>
            </div>
            <div className="rounded-md border bg-muted/40 p-3">
              <p className="text-muted-foreground">Departments</p>
              <p className="mt-1 text-2xl font-semibold">{stats.departments}</p>
            </div>
            <div className="rounded-md border bg-muted/40 p-3">
              <p className="text-muted-foreground">Respondents</p>
              <p className="mt-1 text-2xl font-semibold">{stats.respondents}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase text-primary">Visual Prototype</p>
          <h3 className="mt-1 text-2xl font-semibold">One maintenance request from start to finish</h3>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            This is the simplest way to explain the proposed system in a meeting:
            one request moves through the company, and each team sees only the part
            they need.
          </p>
        </div>

        <div className="overflow-x-auto">
          <div className="grid min-w-[1180px] grid-cols-5 gap-4">
            {visualScreens.map((screen, index) => (
              <div key={screen.title} className="relative">
                <div className="rounded-lg border-2 border-slate-200 bg-white shadow-sm">
                  <div className="flex items-center gap-3 border-b bg-slate-50 px-4 py-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-teal-50 text-primary">
                      <screen.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="truncate text-sm font-semibold">{screen.title}</h4>
                      <p className="text-xs text-muted-foreground">{screen.footer}</p>
                    </div>
                  </div>
                  <div className="grid gap-2 p-4">
                    {screen.lines.map((line) => (
                      <div key={line} className="rounded-md border bg-slate-50 px-3 py-2 text-xs font-medium">
                        {line}
                      </div>
                    ))}
                  </div>
                  <div className="border-t px-4 py-2 text-xs font-medium text-primary">
                    Screen {index + 1}
                  </div>
                </div>
                {index < visualScreens.length - 1 ? (
                  <div className="absolute -right-4 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border bg-white text-primary xl:flex">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 rounded-md bg-teal-50 p-4 text-sm text-teal-950">
          The questionnaire answers decide the rules inside these screens: who can
          request, who approves, what technicians update, how parts are issued, who
          sees cost, and what management reports must show.
        </div>
      </section>

      <section className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <ClipboardList className="h-6 w-6 text-primary" />
          <div>
            <h3 className="text-xl font-semibold">What we are building</h3>
            <p className="text-sm text-muted-foreground">
              A simple maintenance workflow that connects requests, approvals, work,
              parts, cost, and management reports.
            </p>
          </div>
        </div>

        <div className="grid gap-3 xl:grid-cols-5">
          {simpleFlow.map((step, index) => (
            <div key={step.title} className="relative rounded-lg border bg-white p-4">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-teal-50 text-primary">
                <step.icon className="h-5 w-5" />
              </div>
              <h4 className="text-base font-semibold">{step.title}</h4>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.text}</p>
              {index < simpleFlow.length - 1 ? (
                <ArrowRight className="absolute -right-5 top-1/2 hidden h-5 w-5 text-primary xl:block" />
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-semibold">Before and after</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border bg-slate-50 p-4">
              <h4 className="font-semibold">Today</h4>
              <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
                <li>Paper work orders</li>
                <li>Manual parts request forms</li>
                <li>Status updates through calls or messages</li>
                <li>Reports prepared manually</li>
                <li>Difficult to know delay, cost, and responsibility</li>
              </ul>
            </div>
            <div className="rounded-lg border bg-teal-50 p-4 text-teal-950">
              <h4 className="font-semibold">Future system</h4>
              <ul className="mt-3 grid gap-2 text-sm">
                <li>Digital maintenance request</li>
                <li>Approval and assignment tracking</li>
                <li>Technician mobile updates</li>
                <li>Parts, purchase, and cost linked to work order</li>
                <li>Dashboards and exports for management</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-semibold">What the questions will decide</h3>
          </div>
          <div className="grid gap-2">
            {decisions.map((decision) => (
              <div key={decision} className="flex items-start gap-3 rounded-md border bg-white p-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p className="text-sm font-medium">{decision}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <UsersRound className="h-6 w-6 text-primary" />
          <div>
            <h3 className="text-xl font-semibold">What each person will understand</h3>
            <p className="text-sm text-muted-foreground">
              This is the part to show to IT Manager, management, CEO, and departments.
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {roleViews.map((view) => (
            <div key={view.title} className="rounded-lg border bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-teal-50 p-2 text-primary">
                  <view.icon className="h-5 w-5" />
                </div>
                <h4 className="font-semibold">{view.title}</h4>
              </div>
              <div className="mt-4 rounded-md bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase text-muted-foreground">They will see</p>
                <p className="mt-1 text-sm">{view.sees}</p>
              </div>
              <div className="mt-3 rounded-md bg-teal-50 p-3 text-teal-950">
                <p className="text-xs font-semibold uppercase">Their answers decide</p>
                <p className="mt-1 text-sm">{view.decision}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
