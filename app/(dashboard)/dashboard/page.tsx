import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { logoutAction } from "@/features/auth/actions";
import { getSession } from "@/features/auth/session";

// Placeholder for the doctor / receptionist dashboards. Owners live in /owner.
export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.user.role === "CLINIC_OWNER") redirect("/owner/doctors");

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-start justify-center gap-4 p-6">
      <h1 className="text-xl font-bold text-grey-900">Dashboard</h1>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm text-grey-500">
        <dt>Role</dt>
        <dd className="text-grey-900">{session.user.role}</dd>
        <dt>Clinic</dt>
        <dd className="text-grey-900">{session.user.clinicId ?? "-"}</dd>
        <dt>Membership</dt>
        <dd className="text-grey-900">{session.user.membershipId ?? "-"}</dd>
      </dl>
      <form action={logoutAction}>
        <Button type="submit" variant="outline">
          Sign out
        </Button>
      </form>
    </main>
  );
}
