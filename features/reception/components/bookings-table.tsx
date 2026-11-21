import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AvatarInitials } from "@/features/owner/components/avatar-initials";
import { StatusBadge } from "@/features/owner/components/status-badge";

import { APPOINTMENT_TONE, formatStatus } from "../constants";
import type { Appointment } from "../types";
import { AppointmentActions } from "./appointment-actions";
import { formatDateTime } from "./format";

export function BookingsTable({
  appointments,
}: {
  appointments: Appointment[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Patient</TableHead>
          <TableHead>Doctor</TableHead>
          <TableHead>Date & time</TableHead>
          <TableHead>Reason</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments.map((a) => (
          <TableRow key={a.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <AvatarInitials
                  firstName={a.patient.firstName}
                  lastName={a.patient.lastName}
                />
                <div className="flex flex-col">
                  <span className="font-medium">
                    {a.patient.firstName} {a.patient.lastName}
                  </span>
                  <span className="text-muted-foreground">
                    {a.patient.phone || "-"}
                  </span>
                </div>
              </div>
            </TableCell>
            <TableCell>
              Dr. {a.doctor.firstName} {a.doctor.lastName}
            </TableCell>
            <TableCell>{formatDateTime(a.startAt)}</TableCell>
            <TableCell className="max-w-48 truncate">
              {a.reason || "-"}
            </TableCell>
            <TableCell>
              <StatusBadge tone={APPOINTMENT_TONE[a.status]}>
                {formatStatus(a.status)}
              </StatusBadge>
            </TableCell>
            <TableCell>
              <AppointmentActions id={a.id} status={a.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
