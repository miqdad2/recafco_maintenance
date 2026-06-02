import { z } from "zod";

export const tokenAnswerActionSchema = z.object({
  secure_token: z.string().min(32),
  intent: z.enum(["draft", "submit"])
});

export const allowedUploadTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]);

export const maxUploadSize = 10 * 1024 * 1024;
