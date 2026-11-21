import type { Metadata } from "next";
import { ArrowLeft, ClipboardList } from "lucide-react";
import Link from "next/link";

import { FormError } from "@/features/auth/components/form-field";
import { ConsultationsTable } from "@/features/doctor/components/consultations-table";
import {
  DOCTOR_ROUTES,
  formatDate,
  formatGender,
} from "@/features/doctor/constants";
import { getPatient } from "@/features/doctor/queries";
import { AvatarInitials } from "@/features/owner/components/avatar-initials";
import { ContactLines } from "@/features/owner/components/doctors-table";
import { EmptyState } from "@/features/owner/components/empty-state";
import { PageHeading } from "@/features/owner/components/page-heading";
import { Surface } from "@/features/owner/components/surface";

export const metadata: Metadata = { title: "Patient" };

type Props = { params: Promise<{ id: string }> };

export default async function PatientPage({ params }: Props) {
  const { id } = await params;
  const result = await getPatient(id);

  const back = (
    <Link
      href={DOCTOR_ROUTES.patients}
      className="flex items-center gap-1.5 text-sm text-primary"
    >
      <ArrowLeft aria-hidden className="size-4" />
      All patients
    </Link>
  );

  if (!result.ok) {
    return (
      <>
        {back}
        <FormError message={result.message} />
      </>
    );
  }

  const { patient, consultations } = result.data;

  return (
    <>
      {back}
      <PageHeading
        subtitle="Patient profile"
        title={`${patient.firstName} ${patient.lastName}`}
      />

      <Surface className="flex flex-wrap items-center gap-6 p-6">
        <AvatarInitials
          firstName={patient.firstName}
          lastName={patient.lastName}
        />
        <ContactLines email={patient.email} phone={patient.phone} />
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          <dt className="text-muted-foreground">Gender</dt>
          <dd>{formatGender(patient.gender)}</dd>
          <dt className="text-muted-foreground">Birth date</dt>
          <dd>{formatDate(patient.birthDay)}</dd>
        </dl>
      </Surface>

      <Surface className="flex flex-col gap-6 p-6">
        <h2 className="text-2xl leading-6 font-semibold tracking-[-0.6px] text-foreground">
          Previous consultations
        </h2>
        {consultations.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No consultation yet"
            description="Consultations with this patient will be listed here."
          />
        ) : (
          <ConsultationsTable
            consultations={consultations}
            showPatient={false}
          />
        )}
      </Surface>
    </>
  );
}
