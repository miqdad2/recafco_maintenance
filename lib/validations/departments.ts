import { z } from "zod";

export const departmentSchema = z.object({
  name: z.string().trim().min(2, "Department name is required").max(120),
  code: z.string().trim().max(30).optional().or(z.literal("")),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  manager_name: z.string().trim().max(120).optional().or(z.literal("")),
  manager_email: z
    .string()
    .trim()
    .email("Enter a valid manager email")
    .optional()
    .or(z.literal("")),
  is_active: z.coerce.boolean().default(true)
});

export type DepartmentInput = z.infer<typeof departmentSchema>;
