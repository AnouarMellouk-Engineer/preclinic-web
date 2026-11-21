// app/(reception)/reception/layout.tsx
import { Suspense } from "react";

import { ReceptionShell } from "@/features/reception/components/reception-shell";

export default function ReceptionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={<div className="dashboard-theme min-h-screen bg-background" />}
    >
      <ReceptionShell>{children}</ReceptionShell>
    </Suspense>
  );
}
