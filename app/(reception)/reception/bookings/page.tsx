// app/(reception)/reception/bookings/page.tsx
import type { Metadata } from "next";
import { CalendarDays } from "lucide-react";

import { FormError } from "@/features/auth/components/form-field";
import { EmptyState } from "@/features/owner/components/empty-state";
import { PageHeading } from "@/features/owner/components/page-heading";
import { StatCard, StatGrid } from "@/features/owner/components/stat-card";
import { Surface } from "@/features/owner/components/surface";
import { TableToolbar } from "@/features/owner/components/table-toolbar";
import { BookingsTable } from "@/features/reception/components/bookings-table";
import { CreateBookingDialog } from "@/features/reception/components/create-booking-dialog";
import { APPOINTMENT_STATUS_OPTIONS } from "@/features/reception/constants";
import {
  getAppointments,
  getDoctorOptions,
} from "@/features/reception/queries";

export const metadata: Metadata = { title: "Bookings" };

type Props = { searchParams: Promise<{ q?: string; status?: string }> };

export default async function BookingsPage({ searchParams }: Props) {
  const { q = "", status = "" } = await searchParams;

  // No status filter => the API defaults to PENDING + CONFIRMED.
  const [result, doctors] = await Promise.all([
    getAppointments({ status: status || undefined }),
    getDoctorOptions(),
  ]);

  const all = result.ok ? result.data : [];
  const needle = q.toLowerCase();
  const appointments = all.filter(
    (a) =>
      !needle ||
      `${a.patient.firstName} ${a.patient.lastName} ${a.patient.phone} ${a.doctor.firstName} ${a.doctor.lastName}`
        .toLowerCase()
        .includes(needle),
  );
  const filtered = Boolean(q || status);
  const count = (s: string) => all.filter((a) => a.status === s).length;

  return (
    <>
      <PageHeading
        subtitle="Manage the appointments of your clinic"
        title="Bookings"
        action={<CreateBookingDialog doctors={doctors} />}
      />

      <StatGrid>
        <StatCard value={all.length} label="Shown" />
        <StatCard value={count("PENDING")} label="Pending" />
        <StatCard value={count("CONFIRMED")} label="Confirmed" />
        <StatCard value={count("CANCELLED")} label="Cancelled" />
      </StatGrid>

      <Surface className="flex flex-col gap-6 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl leading-6 font-semibold tracking-[-0.6px] text-foreground">
            Clinic bookings
          </h2>
          <TableToolbar
            placeholder="Search a patient or doctor..."
            filter={{
              param: "status",
              allLabel: "Pending & confirmed",
              options: APPOINTMENT_STATUS_OPTIONS,
            }}
          />
        </div>

        {!result.ok ? (
          <FormError message={result.message} />
        ) : appointments.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title={
              filtered ? "No booking matches your search" : "No bookings yet"
            }
            description={
              filtered
                ? "Try another name or change the status filter."
                : "Create the first booking for a patient."
            }
          />
        ) : (
          <BookingsTable appointments={appointments} />
        )}
      </Surface>
    </>
  );
}
