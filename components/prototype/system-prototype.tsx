import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardList,
  GitBranch,
  MessageCircleQuestion,
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

const decisionPath = [
  {
    label: "Request",
    owner: "Department",
    question: "Who is allowed to submit maintenance request?",
    outcome: "Creates request permission rules"
  },
  {
    label: "Approval",
    owner: "Maintenance / Manager",
    question: "Does every work order need approval before work starts?",
    outcome: "Builds approval and emergency rules"
  },
  {
    label: "Execution",
    owner: "Technician",
    question: "Should technicians update job status from mobile?",
    outcome: "Defines mobile screens and required updates"
  },
  {
    label: "Parts",
    owner: "Store / Purchase",
    question: "What happens if parts are not available?",
    outcome: "Connects stock, purchase, and delay tracking"
  },
  {
    label: "Cost",
    owner: "Finance / CEO",
    question: "What cost limit requires CEO approval?",
    outcome: "Sets price visibility and approval limits"
  },
  {
    label: "Reports",
    owner: "Management",
    question: "What KPIs should management see?",
    outcome: "Defines dashboards and monthly summaries"
  }
];

const stakeholderConversation = [
  {
    role: "IT Manager",
    message: "We need to know hosting, login, roles, backups, audit logs, and network access."
  },
  {
    role: "Maintenance Manager",
    message: "We need to know who creates, approves, assigns, closes, and tracks each work order."
  },
  {
    role: "Technician",
    message: "We need mobile assigned jobs, start and finish time, materials, photos, and weak internet support."
  },
  {
    role: "Store / Finance",
    message: "We need clear rules for parts issue, purchase requests, stock deduction, cost visibility, and approvals."
  },
  {
    role: "System result",
    message: "After collecting these answers, the final system screens, permissions, workflow, reports, and exports become clear."
  }
];

const systemInputs = [
  {
    title: "Departments",
    text: "Raise maintenance request with machine, location, priority, and attachments.",
    icon: Building2
  },
  {
    title: "IT / Admin",
    text: "Controls users, roles, access, audit logs, backup, and security.",
    icon: ShieldCheck
  },
  {
    title: "Maintenance",
    text: "Approves request, creates work order, assigns technician, and closes job.",
    icon: Wrench
  }
];

const systemOutputs = [
  {
    title: "Technician",
    text: "Receives job on mobile, updates time, work status, materials, and photos.",
    icon: Smartphone
  },
  {
    title: "Store / Purchase / Finance",
    text: "Handles parts issue, purchase request, stock, cost, and finance approval.",
    icon: PackageCheck
  },
  {
    title: "Management",
    text: "Views KPIs, overdue work, downtime, cost, reports, and department comparison.",
    icon: LayoutDashboard
  }
];

const workflowStages = ["Request", "Approve", "Assign", "Work", "Parts", "Close", "Report"];

const animatedStages = [
  {
    title: "Request",
    owner: "Department",
    text: "Problem, machine, priority, photos",
    icon: Building2,
    color: "border-sky-200 bg-sky-50 text-sky-900"
  },
  {
    title: "Approve",
    owner: "Manager",
    text: "Approval rules and emergency flow",
    icon: CheckCircle2,
    color: "border-amber-200 bg-amber-50 text-amber-950"
  },
  {
    title: "Work Order",
    owner: "Maintenance",
    text: "One controlled record for the job",
    icon: ClipboardList,
    color: "border-teal-200 bg-teal-50 text-teal-950"
  },
  {
    title: "Technician",
    owner: "Mobile",
    text: "Status, time, material, photos",
    icon: Smartphone,
    color: "border-violet-200 bg-violet-50 text-violet-950"
  },
  {
    title: "Parts / Cost",
    owner: "Store, Purchase, Finance",
    text: "Stock, purchase, approval, cost",
    icon: PackageCheck,
    color: "border-rose-200 bg-rose-50 text-rose-950"
  },
  {
    title: "Reports",
    owner: "Management",
    text: "KPIs, overdue jobs, downtime, cost",
    icon: LayoutDashboard,
    color: "border-emerald-200 bg-emerald-50 text-emerald-950"
  }
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
        <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-primary">Animated Flow View</p>
            <h3 className="mt-1 text-2xl font-semibold">Watch one request become a completed work order</h3>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
              This view is for quick presentation. It uses movement and color to
              show the full journey without needing to explain every screen first.
            </p>
          </div>
          <div className="rounded-md border bg-slate-50 px-4 py-3 text-sm">
            <p className="font-semibold">Simple message</p>
            <p className="mt-1 text-muted-foreground">
              Paper forms become one tracked digital workflow.
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border bg-white p-5">
          <div className="relative min-h-[340px]">
            <div className="prototype-flow-track absolute left-[8%] right-[8%] top-[142px] hidden h-2 rounded-full bg-slate-100 lg:block" />
            <div className="prototype-flow-pulse absolute left-[8%] top-[136px] hidden h-5 w-5 rounded-full border-4 border-white bg-primary shadow-lg lg:block" />

            <div className="grid gap-4 lg:grid-cols-6">
              {animatedStages.map((stage, index) => (
                <div
                  key={stage.title}
                  className="prototype-flow-card relative rounded-lg border bg-white p-4 shadow-sm"
                  style={{ animationDelay: `${index * 0.25}s` }}
                >
                  <div className={`rounded-lg border p-3 ${stage.color}`}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/70">
                        <stage.icon className="h-5 w-5" />
                      </div>
                      <span className="rounded-full bg-white/70 px-2 py-1 text-xs font-semibold">
                        {index + 1}
                      </span>
                    </div>
                    <h4 className="mt-4 text-base font-semibold">{stage.title}</h4>
                    <p className="mt-1 text-xs font-semibold uppercase opacity-80">{stage.owner}</p>
                    <p className="mt-3 min-h-12 text-sm leading-6">{stage.text}</p>
                  </div>
                  {index < animatedStages.length - 1 ? (
                    <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 text-primary lg:block" />
                  ) : null}
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1.2fr_1fr]">
              <div className="rounded-lg border bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase text-muted-foreground">Before</p>
                <h4 className="mt-1 text-lg font-semibold">Paper and messages</h4>
                <div className="mt-4 grid gap-2">
                  <div className="h-3 w-10/12 rounded-full bg-slate-200" />
                  <div className="h-3 w-8/12 rounded-full bg-slate-200" />
                  <div className="h-3 w-11/12 rounded-full bg-slate-200" />
                </div>
              </div>

              <div className="rounded-lg border-2 border-primary/20 bg-teal-50 p-4 text-teal-950">
                <p className="text-xs font-semibold uppercase">System control</p>
                <h4 className="mt-1 text-lg font-semibold">Rules from questionnaire answers</h4>
                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  <div className="rounded-md bg-white/75 p-3 text-sm font-medium">Permissions</div>
                  <div className="rounded-md bg-white/75 p-3 text-sm font-medium">Approvals</div>
                  <div className="rounded-md bg-white/75 p-3 text-sm font-medium">Reports</div>
                </div>
              </div>

              <div className="rounded-lg border bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase text-muted-foreground">After</p>
                <h4 className="mt-1 text-lg font-semibold">Dashboard and exports</h4>
                <div className="mt-4 flex items-end gap-2">
                  <div className="prototype-bar h-10 w-1/5 rounded-t-md bg-sky-400" />
                  <div className="prototype-bar h-16 w-1/5 rounded-t-md bg-teal-500" />
                  <div className="prototype-bar h-12 w-1/5 rounded-t-md bg-amber-400" />
                  <div className="prototype-bar h-20 w-1/5 rounded-t-md bg-violet-500" />
                  <div className="prototype-bar h-14 w-1/5 rounded-t-md bg-emerald-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase text-primary">System Diagram</p>
          <h3 className="mt-1 text-2xl font-semibold">Future maintenance system at a glance</h3>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            This is the fastest visual explanation: requests enter from departments,
            the work order controls the process, and each team receives only the
            screen and information they need.
          </p>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr_1fr]">
          <div className="grid gap-3">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Inputs and control</p>
            {systemInputs.map((item) => (
              <div key={item.title} className="rounded-lg border bg-white p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-teal-50 text-primary">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">{item.title}</h4>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="relative rounded-lg border-2 border-primary/20 bg-slate-50 p-5">
            <div className="absolute left-0 top-1/2 hidden h-px w-8 -translate-x-8 bg-primary/40 xl:block" />
            <div className="absolute right-0 top-1/2 hidden h-px w-8 translate-x-8 bg-primary/40 xl:block" />
            <div className="rounded-lg border bg-white p-5 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-md bg-teal-50 text-primary">
                <ClipboardList className="h-7 w-7" />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase text-primary">Core record</p>
              <h4 className="mt-1 text-2xl font-semibold">Maintenance Work Order</h4>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                One controlled record connects request details, approval, technician
                work, parts, cost, attachments, review, and reporting.
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-7">
              {workflowStages.map((stage, index) => (
                <div key={stage} className="relative rounded-md border bg-white px-3 py-2 text-center">
                  <p className="text-[11px] font-semibold text-muted-foreground">Step {index + 1}</p>
                  <p className="mt-1 text-xs font-semibold">{stage}</p>
                  {index < workflowStages.length - 1 ? (
                    <ArrowRight className="absolute -right-3 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-primary xl:block" />
                  ) : null}
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-md bg-teal-50 p-3 text-teal-950">
                <p className="text-xs font-semibold">Permissions</p>
                <p className="mt-1 text-sm">Who can see or change each part</p>
              </div>
              <div className="rounded-md bg-teal-50 p-3 text-teal-950">
                <p className="text-xs font-semibold">Approvals</p>
                <p className="mt-1 text-sm">Who must approve before work or cost</p>
              </div>
              <div className="rounded-md bg-teal-50 p-3 text-teal-950">
                <p className="text-xs font-semibold">Reports</p>
                <p className="mt-1 text-sm">What management needs to monitor</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Team views and outputs</p>
            {systemOutputs.map((item) => (
              <div key={item.title} className="rounded-lg border bg-white p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-teal-50 text-primary">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">{item.title}</h4>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.text}</p>
                  </div>
                </div>
              </div>
            ))}
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
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase text-primary">Diagram View</p>
          <h3 className="mt-1 text-2xl font-semibold">Questionnaire answers become system rules</h3>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            This view is useful at the beginning of a meeting because it shows why
            every department is being asked questions before the final maintenance
            system is designed.
          </p>
        </div>

        <div className="grid gap-3 lg:grid-cols-6">
          {decisionPath.map((item, index) => (
            <div key={item.label} className="relative rounded-lg border bg-white p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-teal-50 text-primary">
                  <GitBranch className="h-5 w-5" />
                </div>
                <span className="rounded-full border bg-slate-50 px-2 py-1 text-xs font-semibold text-muted-foreground">
                  {index + 1}
                </span>
              </div>
              <h4 className="text-base font-semibold">{item.label}</h4>
              <p className="mt-1 text-xs font-medium uppercase text-primary">{item.owner}</p>
              <div className="mt-4 rounded-md bg-slate-50 p-3">
                <p className="text-xs font-semibold text-muted-foreground">Question</p>
                <p className="mt-1 text-sm font-medium">{item.question}</p>
              </div>
              <div className="mt-3 rounded-md bg-teal-50 p-3 text-teal-950">
                <p className="text-xs font-semibold">System rule</p>
                <p className="mt-1 text-sm">{item.outcome}</p>
              </div>
              {index < decisionPath.length - 1 ? (
                <ArrowRight className="absolute -right-5 top-1/2 hidden h-5 w-5 text-primary lg:block" />
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_420px]">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <MessageCircleQuestion className="h-6 w-6 text-primary" />
            <div>
              <p className="text-xs font-semibold uppercase text-primary">Meeting Chat View</p>
              <h3 className="text-xl font-semibold">How to explain it quickly to stakeholders</h3>
            </div>
          </div>
          <div className="grid gap-3">
            {stakeholderConversation.map((item, index) => (
              <div
                key={item.role}
                className={`max-w-3xl rounded-lg border p-4 ${
                  index === stakeholderConversation.length - 1
                    ? "ml-auto bg-teal-50 text-teal-950"
                    : "bg-white"
                }`}
              >
                <p className="text-xs font-semibold uppercase text-primary">{item.role}</p>
                <p className="mt-2 text-sm leading-6">{item.message}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h3 className="text-xl font-semibold">Best first explanation</h3>
          <div className="mt-4 grid gap-3">
            <div className="rounded-md border bg-white p-4">
              <p className="text-sm font-semibold">1. Show the lifecycle</p>
              <p className="mt-1 text-sm text-muted-foreground">
                One request moves from department to maintenance, technician,
                store, finance, and management.
              </p>
            </div>
            <div className="rounded-md border bg-white p-4">
              <p className="text-sm font-semibold">2. Show the questions</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Every question captures a rule the final system must follow.
              </p>
            </div>
            <div className="rounded-md border bg-white p-4">
              <p className="text-sm font-semibold">3. Show the result</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Screens, permissions, approvals, reports, and exports are based
                on confirmed answers.
              </p>
            </div>
          </div>
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
