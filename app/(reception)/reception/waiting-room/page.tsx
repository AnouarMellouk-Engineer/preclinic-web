// app/(reception)/reception/waiting-room/page.tsx
import type { Metadata } from "next";
import { Users } from "lucide-react";

import { FormError } from "@/features/auth/components/form-field";
import { EmptyState } from "@/features/owner/components/empty-state";
import { PageHeading } from "@/features/owner/components/page-heading";
import { StatCard, StatGrid } from "@/features/owner/components/stat-card";
import { Surface } from "@/features/owner/components/surface";
import { TableToolbar } from "@/features/owner/components/table-toolbar";
import { WaitingRoomTable } from "@/features/reception/components/waiting-room-table";
import { getDoctorOptions, getWaitingRoom } from "@/features/reception/queries";

export const metadata: Metadata = { title: "Waiting room" };

type Props = { searchParams: Promise<{ q?: string; doctorId?: string }> };

export default async function WaitingRoomPage({ searchParams }: Props) {
  const { q = "", doctorId = "" } = await searchParams;

  const [result, doctors] = await Promise.all([
    getWaitingRoom({ doctorId: doctorId || undefined }),
    getDoctorOptions(),
  ]);

  const all = result.ok ? result.data : [];
  const needle = q.toLowerCase();
  const entries = all.filter(
    (e) =>
      !needle ||
      `${e.patient.firstName} ${e.patient.lastName} ${e.patient.phone}`
        .toLowerCase()
        .includes(needle),
  );
  const filtered = Boolean(q || doctorId);

  return (
    <>
      <PageHeading
        subtitle="Patients currently waiting to be seen"
        title="Waiting room"
      />

      <StatGrid>
        <StatCard value={all.length} label="Waiting" />
        <StatCard
          value={
            new Set(all.map((e) => `${e.doctor.firstName}${e.doctor.lastName}`))
              .size
          }
          label="Doctors concerned"
        />
      </StatGrid>

      <Surface className="flex flex-col gap-6 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl leading-6 font-semibold tracking-[-0.6px] text-foreground">
            Queue
          </h2>
          <TableToolbar
            placeholder="Search a patient..."
            filter={{
              param: "doctorId",
              allLabel: "All doctors",
              options: doctors.map((d) => ({ value: d.id, label: d.name })),
            }}
          />
        </div>

        {!result.ok ? (
          <FormError message={result.message} />
        ) : entries.length === 0 ? (
          <EmptyState
            icon={Users}
            title={
              filtered
                ? "No patient matches your search"
                : "The waiting room is empty"
            }
            description={
              filtered
                ? "Try another name or clear the doctor filter."
                : "Checked-in patients will show up here."
            }
          />
        ) : (
          <WaitingRoomTable entries={entries} />
        )}
      </Surface>
    </>
  );
}
