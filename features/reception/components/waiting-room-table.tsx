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

import { WAITING_TONE, formatStatus } from "../constants";
import type { WaitingEntry } from "../types";
import { formatTime } from "./format";

export function WaitingRoomTable({ entries }: { entries: WaitingEntry[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>#</TableHead>
          <TableHead>Patient</TableHead>
          <TableHead>Doctor</TableHead>
          <TableHead>Checked in at</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {entries.map((e, i) => (
          <TableRow key={e.id || i}>
            <TableCell className="text-muted-foreground">{i + 1}</TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <AvatarInitials
                  firstName={e.patient.firstName}
                  lastName={e.patient.lastName}
                />
                <div className="flex flex-col">
                  <span className="font-medium">
                    {e.patient.firstName} {e.patient.lastName}
                  </span>
                  <span className="text-muted-foreground">
                    {e.patient.phone || "-"}
                  </span>
                </div>
              </div>
            </TableCell>
            <TableCell>
              Dr. {e.doctor.firstName} {e.doctor.lastName}
            </TableCell>
            <TableCell>{formatTime(e.since)}</TableCell>
            <TableCell>
              <StatusBadge tone={WAITING_TONE[e.status]}>
                {formatStatus(e.status)}
              </StatusBadge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
