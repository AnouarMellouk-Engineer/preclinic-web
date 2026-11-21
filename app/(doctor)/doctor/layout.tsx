import { Suspense } from "react";

import { DoctorShell } from "@/features/doctor/components/doctor-shell";

// DoctorShell reads the session cookie (runtime data), so it sits inside <Suspense>
// (cacheComponents). proxy.ts already blocks non-doctors earlier.
export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={<div className="dashboard-theme min-h-screen bg-background" />}
    >
      <DoctorShell>{children}</DoctorShell>
    </Suspense>
  );
}
