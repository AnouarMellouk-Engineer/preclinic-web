import { Suspense } from "react";

import { Logo } from "@/components/shared/logo";
import { PageSkeleton } from "@/features/owner/components/owner-shell";

import { requireReceptionist } from "../guards";
import { ReceptionNav } from "./reception-nav";
import { ReceptionTopbar } from "./reception-topbar";

export async function ReceptionShell({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireReceptionist();

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
          <ReceptionNav />
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <ReceptionTopbar />
        <main className="flex flex-col gap-6 p-6">
          <Suspense fallback={<PageSkeleton />}>{children}</Suspense>
        </main>
      </div>
    </div>
  );
}
