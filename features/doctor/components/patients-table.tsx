import { Eye } from "lucide-react";
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
import { ContactLines } from "@/features/owner/components/doctors-table";
import { cn } from "@/lib/utils";

import { DOCTOR_ROUTES, formatDate, formatGender } from "../constants";
import type { Patient } from "../types";

export function PatientsTable({ patients }: { patients: Patient[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Patient</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Gender</TableHead>
          <TableHead>Birth date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {patients.map((p) => (
          <TableRow key={p.id || p.email}>
            <TableCell>
              <div className="flex items-center gap-3">
                <AvatarInitials firstName={p.firstName} lastName={p.lastName} />
                <span className="font-medium">
                  {p.firstName} {p.lastName}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <ContactLines email={p.email} phone={p.phone} />
            </TableCell>
            <TableCell>{formatGender(p.gender)}</TableCell>
            <TableCell>{formatDate(p.birthDay)}</TableCell>
            <TableCell className="text-right">
              {p.id && (
                <Link
                  href={`${DOCTOR_ROUTES.patients}/${p.id}`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "gap-1.5",
                  )}
                >
                  <Eye aria-hidden />
                  View
                </Link>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
