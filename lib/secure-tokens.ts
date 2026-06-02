import { randomBytes } from "crypto";

export function generateSecureToken() {
  return randomBytes(32).toString("base64url");
}

export function buildQuestionnaireLink(token: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL
    ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  return `${appUrl.replace(/\/$/, "")}/q/${token}`;
}

export function defaultTokenExpiry() {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);
  return expiresAt.toISOString();
}
