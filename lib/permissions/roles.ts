import type { UserRole } from "@/types/database";

export const adminRoles: UserRole[] = ["super_admin", "requirement_admin"];
export const dashboardRoles: UserRole[] = [
  "super_admin",
  "requirement_admin",
  "reviewer",
  "viewer"
];

export function canManageDepartments(role: UserRole) {
  return role === "super_admin" || role === "requirement_admin";
}

export function canManageRespondents(role: UserRole) {
  return role === "super_admin" || role === "requirement_admin";
}

export function roleLabel(role: UserRole) {
  return role
    .split("_")
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");
}
