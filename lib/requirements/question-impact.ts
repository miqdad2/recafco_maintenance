export type QuestionImpact = {
  area: string;
  purpose: string;
  systemOutput: string;
};

const impactRules: Array<{
  keywords: string[];
  impact: QuestionImpact;
}> = [
  {
    keywords: ["scope", "phase 1", "later"],
    impact: {
      area: "Project Scope",
      purpose: "Clarifies what must be included now and what can wait.",
      systemOutput: "Phase boundaries, module list, and implementation priority"
    }
  },
  {
    keywords: ["deadline", "first working version"],
    impact: {
      area: "Delivery Plan",
      purpose: "Shows how fast the first usable version is needed.",
      systemOutput: "Milestones, release plan, and rollout sequence"
    }
  },
  {
    keywords: ["hosted", "server", "kuwait", "outside"],
    impact: {
      area: "Hosting and Access",
      purpose: "Defines where the system runs and who can reach it.",
      systemOutput: "Hosting choice, network rules, and access restrictions"
    }
  },
  {
    keywords: ["login", "email", "employee", "username", "two-factor"],
    impact: {
      area: "Authentication",
      purpose: "Defines how staff sign in and how strong login security must be.",
      systemOutput: "Login method, password policy, and optional 2FA requirement"
    }
  },
  {
    keywords: ["audit", "logged", "action"],
    impact: {
      area: "Audit and Control",
      purpose: "Defines what activity must be tracked for accountability.",
      systemOutput: "Audit log events, review trail, and admin reports"
    }
  },
  {
    keywords: ["english", "arabic", "bilingual", "language"],
    impact: {
      area: "User Interface",
      purpose: "Defines the language needs for forms and screens.",
      systemOutput: "UI language plan and translation requirements"
    }
  },
  {
    keywords: ["approve", "approval", "ceo", "manager"],
    impact: {
      area: "Approval Workflow",
      purpose: "Defines who must approve requests before work continues.",
      systemOutput: "Approval steps, roles, and escalation rules"
    }
  },
  {
    keywords: ["work order", "maintenance", "technician", "assign"],
    impact: {
      area: "Maintenance Workflow",
      purpose: "Defines how maintenance work moves from request to closure.",
      systemOutput: "Work order statuses, assignment rules, and closure flow"
    }
  },
  {
    keywords: ["parts", "stock", "inventory", "purchase", "store"],
    impact: {
      area: "Materials and Stores",
      purpose: "Defines how parts are requested, issued, purchased, and returned.",
      systemOutput: "Parts request flow, inventory rules, and purchase integration"
    }
  },
  {
    keywords: ["cost", "price", "budget", "currency", "finance"],
    impact: {
      area: "Cost and Finance",
      purpose: "Defines what cost information is captured and who can see it.",
      systemOutput: "Cost visibility, approval limits, and financial reports"
    }
  },
  {
    keywords: ["report", "kpi", "dashboard", "summary", "comparison"],
    impact: {
      area: "Reports and Dashboard",
      purpose: "Defines what management needs to monitor.",
      systemOutput: "Dashboard cards, KPIs, export columns, and report filters"
    }
  }
];

const fallbackImpact: QuestionImpact = {
  area: "Business Requirement",
  purpose: "Captures a decision needed before system design is finalized.",
  systemOutput: "Requirement note for SRS and system configuration"
};

export function getQuestionImpact(questionText: string): QuestionImpact {
  const normalized = questionText.toLowerCase();
  const matchedRule = impactRules.find((rule) =>
    rule.keywords.some((keyword) => normalized.includes(keyword))
  );

  return matchedRule?.impact ?? fallbackImpact;
}

export function groupQuestionsByImpact<T extends { question_text: string }>(questions: T[]) {
  const groups = new Map<string, { impact: QuestionImpact; questions: T[] }>();

  for (const question of questions) {
    const impact = getQuestionImpact(question.question_text);
    const existing = groups.get(impact.area);

    if (existing) {
      existing.questions.push(question);
    } else {
      groups.set(impact.area, { impact, questions: [question] });
    }
  }

  return Array.from(groups.values());
}
