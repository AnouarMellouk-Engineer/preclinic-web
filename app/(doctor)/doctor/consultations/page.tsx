import type { Metadata } from "next";
import { ClipboardList } from "lucide-react";

import { FormError } from "@/features/auth/components/form-field";
import { ConsultationsTable } from "@/features/doctor/components/consultations-table";
import { RangeTabs } from "@/features/doctor/components/range-tabs";
import { DOCTOR_ROUTES } from "@/features/doctor/constants";
import { getConsultations } from "@/features/doctor/queries";
import { EmptyState } from "@/features/owner/components/empty-state";
import { PageHeading } from "@/features/owner/components/page-heading";
import { StatCard, StatGrid } from "@/features/owner/components/stat-card";
import { Surface } from "@/features/owner/components/surface";
import { TableToolbar } from "@/features/owner/components/table-toolbar";

export const metadata: Metadata = { title: "Consultations" };

type Props = { searchParams: Promise<{ q?: string; range?: string }> };

export default async function DoctorConsultationsPage({ searchParams }: Props) {
  const { q = "", range = "" } = await searchParams;
  const result = await getConsultations({ patientName: q, range });
  const consultations = result.ok ? result.data : [];
  const filtered = Boolean(q || range);

  return (
    <>
      <PageHeading
        subtitle="History of your consultations"
        title="Consultations"
      />

      <StatGrid>
        <StatCard value={consultations.length} label="Consultations" />
        <StatCard
          value={consultations.filter((c) => c.isSharedWithPatient).length}
          label="Shared with patient"
        />
        <StatCard
          value={consultations.filter((c) => !c.diagnosis).length}
          label="Without diagnosis"
        />
      </StatGrid>

      <Surface className="flex flex-col gap-6 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl leading-6 font-semibold tracking-[-0.6px] text-foreground">
            My consultations
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <RangeTabs
              basePath={DOCTOR_ROUTES.consultations}
              current={range}
              params={q ? { q } : {}}
            />
            <TableToolbar placeholder="Search a patient..." />
          </div>
        </div>

        {!result.ok ? (
          <FormError message={result.message} />
        ) : consultations.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title={
              filtered
                ? "No consultation matches your filters"
                : "No consultations yet"
            }
            description={
              filtered
                ? "Try another period or patient name."
                : "A consultation is created when an appointment is marked completed."
            }
          />
        ) : (
          <ConsultationsTable consultations={consultations} />
        )}
      </Surface>
    </>
  );
}
