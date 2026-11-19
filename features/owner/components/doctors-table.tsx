import { Mail, Phone } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { formatSpecialist } from "../constants";
import type { Doctor } from "../types";
import { AvatarInitials } from "./avatar-initials";
import { StatusBadge } from "./status-badge";

const fee = new Intl.NumberFormat("en", {
  style: "currency",
  currency: "DZD",
  maximumFractionDigits: 0,
});

export function DoctorsTable({ doctors }: { doctors: Doctor[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Doctor</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Specialty</TableHead>
          <TableHead>Consultation fee</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {doctors.map((d) => (
          <TableRow key={d.id || d.email}>
            <TableCell>
              <div className="flex items-center gap-3">
                <AvatarInitials firstName={d.firstName} lastName={d.lastName} />
                <div className="flex flex-col">
                  <span className="font-medium">
                    Dr. {d.firstName} {d.lastName}
                  </span>
                  <span className="text-muted-foreground">{formatSpecialist(d.specialist)}</span>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <ContactLines email={d.email} phone={d.phone} />
            </TableCell>
            <TableCell>{formatSpecialist(d.specialist)}</TableCell>
            <TableCell>
              {d.pricingPerConsultation ? fee.format(Number(d.pricingPerConsultation)) : "-"}
            </TableCell>
            <TableCell>
              <StatusBadge tone={d.isActive ? "success" : "danger"}>
                {d.isActive ? "active" : "inactive"}
              </StatusBadge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function ContactLines({ email, phone }: { email: string; phone: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="flex items-center gap-2">
        <Phone aria-hidden className="size-3 text-muted-foreground" />
        {phone || "-"}
      </span>
      <span className="flex items-center gap-2">
        <Mail aria-hidden className="size-3 text-muted-foreground" />
        {email || "-"}
      </span>
    </div>
  );
}
