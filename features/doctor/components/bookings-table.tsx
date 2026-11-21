import { Phone } from "lucide-react";

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

import { BOOKING_TONE, formatDate, formatTime } from "../constants";
import type { Booking } from "../types";

export function BookingsTable({ bookings }: { bookings: Booking[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Patient</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Reason</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.map((b) => {
          const [first = "", ...rest] = b.patientName.split(" ");
          const tone =
            BOOKING_TONE[b.status as keyof typeof BOOKING_TONE] ?? "warning";
          return (
            <TableRow key={b.id || `${b.startAt}-${b.patientName}`}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <AvatarInitials firstName={first} lastName={rest.join(" ")} />
                  <div className="flex flex-col">
                    <span className="font-medium">{b.patientName}</span>
                    {b.patientPhone && (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Phone aria-hidden className="size-3" />
                        {b.patientPhone}
                      </span>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>{formatDate(b.startAt)}</TableCell>
              <TableCell>
                {formatTime(b.startAt)}
                {b.endAt ? ` - ${formatTime(b.endAt)}` : ""}
              </TableCell>
              <TableCell className="max-w-64 truncate">
                {b.reason || "-"}
              </TableCell>
              <TableCell>
                <StatusBadge tone={tone}>{b.status.toLowerCase()}</StatusBadge>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
