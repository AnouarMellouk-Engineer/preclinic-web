import type { Metadata } from "next";
import { Users } from "lucide-react";

import { FormError } from "@/features/auth/components/form-field";
import { PatientsTable } from "@/features/doctor/components/patients-table";
import { getPatients } from "@/features/doctor/queries";
import { EmptyState } from "@/features/owner/components/empty-state";
import { PageHeading } from "@/features/owner/components/page-heading";
import { StatCard, StatGrid } from "@/features/owner/components/stat-card";
import { Surface } from "@/features/owner/components/surface";
import { TableToolbar } from "@/features/owner/components/table-toolbar";

export const metadata: Metadata = { title: "Patients" };

type Props = { searchParams: Promise<{ q?: string }> };

export default async function DoctorPatientsPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const result = await getPatients(q); // search by name or phone, done by the API
  const patients = result.ok ? result.data : [];

  return (
    <>
      <PageHeading subtitle="Patients you have followed" title="Patients" />

      <StatGrid>
        <StatCard
          value={patients.length}
          label={q ? "Matching patients" : "Total patients"}
        />
        <StatCard
          value={patients.filter((p) => p.gender === "FEMALE").length}
          label="Female"
        />
        <StatCard
          value={patients.filter((p) => p.gender === "MALE").length}
          label="Male"
        />
      </StatGrid>

      <Surface className="flex flex-col gap-6 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl leading-6 font-semibold tracking-[-0.6px] text-foreground">
            My patients
          </h2>
          <TableToolbar placeholder="Search by name or phone..." />
        </div>

        {!result.ok ? (
          <FormError message={result.message} />
        ) : patients.length === 0 ? (
          <EmptyState
            icon={Users}
            title={q ? "No patient matches your search" : "No patients yet"}
            description={
              q
                ? "Try another name or phone number."
                : "Patients appear here after their first appointment with you."
            }
          />
        ) : (
          <PatientsTable patients={patients} />
        )}
      </Surface>
    </>
  );
}
