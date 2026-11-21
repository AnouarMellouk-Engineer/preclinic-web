import { Pencil } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";

import { DOCTOR_ROUTES, formatDateTime } from "../constants";
import type { ConsultationSummary } from "../types";

export function ConsultationsTable({
  consultations,
  showPatient = true,
}: {
  consultations: ConsultationSummary[];
  showPatient?: boolean;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          {showPatient && <TableHead>Patient</TableHead>}
          <TableHead>Date</TableHead>
          <TableHead>Diagnosis</TableHead>
          <TableHead>Shared</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {consultations.map((c) => {
          const [first = "", ...rest] = c.patientName.split(" ");
          return (
            <TableRow key={c.id}>
              {showPatient && (
                <TableCell>
                  <div className="flex items-center gap-3">
                    <AvatarInitials
                      firstName={first}
                      lastName={rest.join(" ")}
                    />
                    <span className="font-medium">{c.patientName}</span>
                  </div>
                </TableCell>
              )}
              <TableCell>{formatDateTime(c.date)}</TableCell>
              <TableCell className="max-w-64 truncate">
                {c.diagnosis || "-"}
              </TableCell>
              <TableCell>
                <StatusBadge
                  tone={c.isSharedWithPatient ? "success" : "warning"}
                >
                  {c.isSharedWithPatient ? "shared" : "private"}
                </StatusBadge>
              </TableCell>
              <TableCell className="text-right">
                <Link
                  href={`${DOCTOR_ROUTES.consultations}/${c.id}`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "gap-1.5",
                  )}
                >
                  <Pencil aria-hidden />
                  Open
                </Link>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
