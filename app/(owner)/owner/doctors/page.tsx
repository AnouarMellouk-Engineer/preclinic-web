import type { Metadata } from "next";
import { Stethoscope } from "lucide-react";

import { FormError } from "@/features/auth/components/form-field";
import { SPECIALIST_OPTIONS } from "@/features/owner/constants";
import { DoctorsTable } from "@/features/owner/components/doctors-table";
import { EmptyState } from "@/features/owner/components/empty-state";
import { InviteStaffDialog } from "@/features/owner/components/invite-staff-dialog";
import { PageHeading } from "@/features/owner/components/page-heading";
import { StatCard, StatGrid } from "@/features/owner/components/stat-card";
import { Surface } from "@/features/owner/components/surface";
import { TableToolbar } from "@/features/owner/components/table-toolbar";
import { getDoctors } from "@/features/owner/queries";

export const metadata: Metadata = { title: "Doctors" };

type Props = { searchParams: Promise<{ q?: string; specialist?: string }> };

export default async function DoctorsPage({ searchParams }: Props) {
  const { q = "", specialist = "" } = await searchParams;
  const result = await getDoctors(); // re-checks CLINIC_OWNER

  const all = result.ok ? result.data : [];
  const needle = q.toLowerCase();
  const doctors = all.filter(
    (d) =>
      (!specialist || d.specialist === specialist) &&
      (!needle ||
        `${d.firstName} ${d.lastName} ${d.email} ${d.phone}`
          .toLowerCase()
          .includes(needle)),
  );
  const filtered = Boolean(q || specialist);

  return (
    <>
      <PageHeading
        subtitle="Manage the doctors of your clinic"
        title="Doctors"
        action={<InviteStaffDialog role="DOCTOR" />}
      />

      <StatGrid>
        <StatCard value={all.length} label="Total doctors" />
        <StatCard value={all.filter((d) => d.isActive).length} label="Active" />
        <StatCard
          value={all.filter((d) => !d.isActive).length}
          label="Inactive"
        />
        <StatCard
          value={new Set(all.map((d) => d.specialist).filter(Boolean)).size}
          label="Specialties"
        />
      </StatGrid>

      <Surface className="flex flex-col gap-6 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl leading-6 font-semibold tracking-[-0.6px] text-foreground">
            Clinic doctors
          </h2>
          <TableToolbar
            placeholder="Search a doctor..."
            filter={{
              param: "specialist",
              allLabel: "All specialties",
              options: SPECIALIST_OPTIONS,
            }}
          />
        </div>

        {!result.ok ? (
          <FormError message={result.message} />
        ) : doctors.length === 0 ? (
          <EmptyState
            icon={Stethoscope}
            title={
              filtered ? "No doctor matches your search" : "No doctors yet"
            }
            description={
              filtered
                ? "Try another name or clear the specialty filter."
                : "Invite your first doctor to start receiving appointments."
            }
          />
        ) : (
          <DoctorsTable doctors={doctors} />
        )}
      </Surface>
    </>
  );
}
