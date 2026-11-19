import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { Receptionist } from "../types";
import { AvatarInitials } from "./avatar-initials";
import { ContactLines } from "./doctors-table";
import { StatusBadge } from "./status-badge";

export function ReceptionistsTable({ receptionists }: { receptionists: Receptionist[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Receptionist</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {receptionists.map((r) => (
          <TableRow key={r.id || r.email}>
            <TableCell>
              <div className="flex items-center gap-3">
                <AvatarInitials firstName={r.firstName} lastName={r.lastName} />
                <span className="font-medium">
                  {r.firstName} {r.lastName}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <ContactLines email={r.email} phone={r.phone} />
            </TableCell>
            <TableCell>
              <StatusBadge tone={r.isActive ? "success" : "danger"}>
                {r.isActive ? "active" : "inactive"}
              </StatusBadge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
