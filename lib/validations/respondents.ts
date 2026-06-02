import { z } from "zod";

export const respondentSchema = z.object({
  department_id: z.string().uuid("Select a department"),
  profile_id: z.string().uuid().optional().or(z.literal("")),
  full_name: z.string().trim().min(2, "Respondent name is required").max(120),
  designation: z.string().trim().max(120).optional().or(z.literal("")),
  email: z.string().trim().email("Enter a valid email").optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  access_type: z.enum(["login", "secure_token"]).default("secure_token"),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
  is_active: z.coerce.boolean().default(true)
});

export type RespondentInput = z.infer<typeof respondentSchema>;
