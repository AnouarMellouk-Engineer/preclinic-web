import "server-only";

import { redirect } from "next/navigation";

import { getSession } from "./session";
import type { Role } from "./token";

/**
 * Server-side role guard (data-access layer).
 * Layouts do NOT protect their pages in Next.js, so call this in every page / query
 * that touches protected data, not only in the layout.
 */
export async function requireRole(...roles: Role[]) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!roles.includes(session.user.role)) redirect("/dashboard");
  return session;
}

export const requireOwner = () => requireRole("CLINIC_OWNER");
export const requireDoctor = () => requireRole("DOCTOR");
