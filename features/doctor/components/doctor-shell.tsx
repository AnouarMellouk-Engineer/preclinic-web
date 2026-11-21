import { Suspense } from "react";

import { Logo } from "@/components/shared/logo";
import { requireDoctor } from "@/features/auth/guards";
import { PageSkeleton } from "@/features/owner/components/owner-shell";

import { DoctorNav } from "./doctor-nav";
import { DoctorTopbar } from "./doctor-topbar";

/** Same shell as the owner area: 256px sidebar + sticky top bar + 24px padded main. */
export async function DoctorShell({ children }: { children: React.ReactNode }) {
  await requireDoctor(); // layout-level guard (pages/queries re-check on their own)

  return (
    <div className="dashboard-theme flex min-h-screen bg-background text-foreground">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r bg-sidebar lg:flex">
        <div className="border-b px-4 py-4">
          <Logo />
        </div>
        <nav aria-label="Main" className="flex flex-col gap-1 p-2">
          <p className="flex h-8 items-center px-2 text-xs font-medium text-foreground/70">
            Main menu
          </p>
          <DoctorNav />
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <DoctorTopbar />
        <main className="flex flex-col gap-6 p-6">
          <Suspense fallback={<PageSkeleton />}>{children}</Suspense>
        </main>
      </div>
    </div>
  );
}
