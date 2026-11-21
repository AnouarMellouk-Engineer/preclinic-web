import type { Metadata } from "next";
import { ArrowLeft, Pill } from "lucide-react";
import Link from "next/link";

import { FormError } from "@/features/auth/components/form-field";
import { ConsultationEditor } from "@/features/doctor/components/consultation-editor";
import { PrescriptionDialog } from "@/features/doctor/components/prescription-dialog";
import { PrivateNotes } from "@/features/doctor/components/private-notes";
import {
  DOCTOR_ROUTES,
  formatDate,
  formatDateTime,
} from "@/features/doctor/constants";
import { getConsultation } from "@/features/doctor/queries";
import { PageHeading } from "@/features/owner/components/page-heading";
import { Surface } from "@/features/owner/components/surface";

import { PrescriptionsList } from "@/features/doctor/components/prescriptions-list";

export const metadata: Metadata = { title: "Consultation" };

type Props = { params: Promise<{ id: string }> };

const sectionTitle =
  "text-2xl leading-6 font-semibold tracking-[-0.6px] text-foreground";

export default async function ConsultationPage({ params }: Props) {
  const { id } = await params;
  const result = await getConsultation(id);

  const back = (
    <Link
      href={DOCTOR_ROUTES.consultations}
      className="flex items-center gap-1.5 text-sm text-primary"
    >
      <ArrowLeft aria-hidden className="size-4" />
      All consultations
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

  const c = result.data;

  return (
    <>
      {back}
      <PageHeading
        subtitle={formatDateTime(c.date)}
        title={c.patientName}
        action={<PrescriptionDialog consultationId={c.id} />}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <Surface className="flex flex-col gap-4 p-6">
          <h2 className={sectionTitle}>Observation &amp; diagnosis</h2>
          <ConsultationEditor
            id={c.id}
            defaultValues={{
              observation: c.observation,
              diagnosis: c.diagnosis,
              isSharedWithPatient: c.isSharedWithPatient,
            }}
          />
        </Surface>

        <Surface className="flex flex-col gap-4 p-6">
          <h2 className={sectionTitle}>Private notes</h2>
          <PrivateNotes id={c.id} notes={c.privateNotes} />
        </Surface>
      </div>

      {/* <Surface className="flex flex-col gap-4 p-6">
        <h2 className={sectionTitle}>Prescriptions</h2>
        {c.prescriptions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No prescription for this consultation.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {c.prescriptions.map((p) => (
              <div
                key={p.id}
                className="flex flex-col gap-3 rounded-[10px] border p-4"
              >
                <p className="text-sm font-semibold text-foreground">
                  Issued {formatDate(p.issuedAt)}
                </p>
                {p.notes && (
                  <p className="text-sm text-muted-foreground">{p.notes}</p>
                )}
                <ul className="flex flex-col divide-y">
                  {p.items.map((i) => (
                    <li
                      key={i.id || i.medicationName}
                      className="flex items-start gap-3 py-2"
                    >
                      <Pill
                        aria-hidden
                        className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                      />
                      <div className="flex flex-col text-sm">
                        <span className="font-medium text-foreground">
                          {i.medicationName}
                        </span>
                        <span className="text-muted-foreground">
                          {i.dosage} · {i.frequency} · {i.duration}
                        </span>
                        {i.instructions && (
                          <span className="text-muted-foreground">
                            {i.instructions}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </Surface> */}
      <Surface className="flex flex-col gap-4 p-6">
        <h2 className={sectionTitle}>Prescriptions</h2>
        <PrescriptionsList prescriptions={c.prescriptions} />
      </Surface>
    </>
  );
}
