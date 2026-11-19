import { Suspense } from "react";

import { OwnerShell } from "@/features/owner/components/owner-shell";

// `OwnerShell` reads the session cookie (runtime data), so it must sit inside <Suspense>
// when `cacheComponents` is enabled. proxy.ts already blocks non-owners earlier.
export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={<div className="dashboard-theme min-h-screen bg-background" />}
    >
      <OwnerShell>{children}</OwnerShell>
    </Suspense>
  );
}
