import type { Metadata } from "next";
import { CalendarDays } from "lucide-react";

import { FormError } from "@/features/auth/components/form-field";
import { BookingsTable } from "@/features/doctor/components/bookings-table";
import { RangeTabs } from "@/features/doctor/components/range-tabs";
import {
  BOOKING_STATUS_OPTIONS,
  DOCTOR_ROUTES,
} from "@/features/doctor/constants";
import { getBookings } from "@/features/doctor/queries";
import { EmptyState } from "@/features/owner/components/empty-state";
import { PageHeading } from "@/features/owner/components/page-heading";
import { StatCard, StatGrid } from "@/features/owner/components/stat-card";
import { Surface } from "@/features/owner/components/surface";
import { TableToolbar } from "@/features/owner/components/table-toolbar";

export const metadata: Metadata = { title: "Bookings" };

type Props = {
  searchParams: Promise<{ q?: string; status?: string; range?: string }>;
};

export default async function DoctorBookingsPage({ searchParams }: Props) {
  const { q = "", status = "", range = "" } = await searchParams;
  const result = await getBookings({ status, range });

  const all = result.ok ? result.data : [];
  const needle = q.toLowerCase();
  const bookings = all.filter(
    (b) =>
      !needle ||
      `${b.patientName} ${b.patientPhone} ${b.reason}`
        .toLowerCase()
        .includes(needle),
  );
  const filtered = Boolean(q || status || range);
  const count = (s: string) => all.filter((b) => b.status === s).length;

  const tabParams: Record<string, string> = {};
  if (q) tabParams.q = q;
  if (status) tabParams.status = status;

  return (
    <>
      <PageHeading subtitle="Your upcoming appointments" title="Bookings" />

      <StatGrid>
        <StatCard value={all.length} label="Total bookings" />
        <StatCard value={count("PENDING")} label="Pending" />
        <StatCard value={count("CONFIRMED")} label="Confirmed" />
        <StatCard value={count("COMPLETED")} label="Completed" />
      </StatGrid>

      <Surface className="flex flex-col gap-6 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl leading-6 font-semibold tracking-[-0.6px] text-foreground">
            My bookings
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <RangeTabs
              basePath={DOCTOR_ROUTES.bookings}
              current={range}
              params={tabParams}
            />
            <TableToolbar
              placeholder="Search a patient..."
              filter={{
                param: "status",
                allLabel: "Upcoming",
                options: BOOKING_STATUS_OPTIONS,
              }}
            />
          </div>
        </div>

        {!result.ok ? (
          <FormError message={result.message} />
        ) : bookings.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title={
              filtered ? "No booking matches your filters" : "No bookings yet"
            }
            description={
              filtered
                ? "Try another period, status or name."
                : "Patients' appointments with you will appear here."
            }
          />
        ) : (
          <BookingsTable bookings={bookings} />
        )}
      </Surface>
    </>
  );
}
