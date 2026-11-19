import { Suspense } from "react";

import { Logo } from "@/components/shared/logo";
import { requireOwner } from "@/features/auth/guards";

import { OwnerNav } from "./owner-nav";
import { OwnerTopbar } from "./owner-topbar";

export function PageSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-6" aria-hidden>
      <div className="h-16 w-64 rounded-md bg-muted" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-24 rounded-[12px] bg-muted" />
        ))}
      </div>
      <div className="h-72 rounded-[12px] bg-muted" />
    </div>
  );
}

/** Figma shell: 256px sidebar (#f7fafc) + sticky top bar + 24px padded main. */
export async function OwnerShell({ children }: { children: React.ReactNode }) {
  await requireOwner(); // layout-level guard (pages re-check on their own)

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
          <OwnerNav />
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <OwnerTopbar />
        <main className="flex flex-col gap-6 p-6">
          <Suspense fallback={<PageSkeleton />}>{children}</Suspense>
        </main>
      </div>
    </div>
  );
}
