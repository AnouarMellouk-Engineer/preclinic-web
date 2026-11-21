import type { Metadata } from "next";
import { CalendarDays } from "lucide-react";
import Link from "next/link";

import { FormError } from "@/features/auth/components/form-field";
import { BookingsTable } from "@/features/doctor/components/bookings-table";
import { WaitingRoomList } from "@/features/doctor/components/waiting-room-card";
import { DOCTOR_ROUTES } from "@/features/doctor/constants";
import {
  getBookings,
  getConsultations,
  getPatients,
  getWaitingRoom,
} from "@/features/doctor/queries";
import { EmptyState } from "@/features/owner/components/empty-state";
import { PageHeading } from "@/features/owner/components/page-heading";
import { StatCard, StatGrid } from "@/features/owner/components/stat-card";
import { Surface } from "@/features/owner/components/surface";

export const metadata: Metadata = { title: "Dashboard" };

const sectionTitle =
  "text-2xl leading-6 font-semibold tracking-[-0.6px] text-foreground";

export default async function DoctorDashboardPage() {
  const [today, waiting, consultations, patients] = await Promise.all([
    getBookings({ range: "today" }),
    getWaitingRoom(),
    getConsultations(),
    getPatients(),
  ]);

  const todayList = today.ok ? today.data : [];
  const waitingList = waiting.ok ? waiting.data : [];

  return (
    <>
      <PageHeading subtitle="Your day at a glance" title="Dashboard" />

      <StatGrid>
        <StatCard value={todayList.length} label="Today's bookings" />
        <StatCard
          value={waitingList.filter((w) => w.status === "WAITING").length}
          label="Patients waiting"
        />
        <StatCard
          value={patients.ok ? patients.data.length : "-"}
          label="My patients"
        />
        <StatCard
          value={consultations.ok ? consultations.data.length : "-"}
          label="Consultations"
        />
      </StatGrid>

      <div className="grid gap-6 xl:grid-cols-2">
        <Surface className="flex flex-col gap-4 p-6">
          <h2 className={sectionTitle}>Waiting room</h2>
          {waiting.ok ? (
            <WaitingRoomList entries={waitingList} />
          ) : (
            <FormError message={waiting.message} />
          )}
        </Surface>

        <Surface className="flex flex-col gap-4 p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className={sectionTitle}>Today&apos;s bookings</h2>
            <Link
              href={DOCTOR_ROUTES.bookings}
              className="text-sm text-primary"
            >
              View all
            </Link>
          </div>
          {!today.ok ? (
            <FormError message={today.message} />
          ) : todayList.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="No booking today"
              description="Your appointments for today will appear here."
            />
          ) : (
            <BookingsTable bookings={todayList.slice(0, 6)} />
          )}
        </Surface>
      </div>
    </>
  );
}
