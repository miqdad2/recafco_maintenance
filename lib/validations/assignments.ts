import { z } from "zod";

export const assignmentSchema = z.object({
  questionnaire_id: z.string().uuid("Select a questionnaire"),
  respondent_id: z.string().uuid("Select a respondent"),
  due_date: z.string().optional().or(z.literal("")),
  token_expires_at: z.string().optional().or(z.literal(""))
});

export type AssignmentInput = z.infer<typeof assignmentSchema>;
