import "server-only";

import { redirect } from "next/navigation";

import { getSession } from "@/features/auth/session";

/** Always re-check the role: layouts/pages are not a security boundary. */
export async function requireReceptionist() {
  const session = await getSession();
  if (!session || session.user.role !== "RECEPTIONIST") redirect("/login");
  return { token: session.token, user: session.user };
}
