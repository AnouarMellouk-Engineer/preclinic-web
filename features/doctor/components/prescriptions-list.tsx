import { ExternalLink, FileText, Pill } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/features/owner/components/status-badge";

import { formatDateTime } from "../constants";
import type { Prescription } from "../types";

export function PrescriptionsList({
  prescriptions,
}: {
  prescriptions: Prescription[];
}) {
  if (prescriptions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No prescription for this consultation.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {prescriptions.map((p, index) => (
        <article
          key={p.id || p.issuedAt}
          className="flex flex-col gap-4 rounded-[10px] border p-4"
        >
          <header className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-col">
              <h3 className="text-sm font-semibold text-foreground">
                Prescription #{prescriptions.length - index}
              </h3>
              <span className="text-xs text-muted-foreground">
                Issued {formatDateTime(p.issuedAt)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge tone="success">
                {p.items.length} medication{p.items.length === 1 ? "" : "s"}
              </StatusBadge>
              {p.pdfUrl && (
                <a
                  href={p.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-sm text-primary"
                >
                  <FileText aria-hidden className="size-4" />
                  PDF
                  <ExternalLink aria-hidden className="size-3" />
                </a>
              )}
            </div>
          </header>

          {p.notes && (
            <div className="rounded-[10px] bg-muted p-3">
              <p className="text-xs font-medium text-muted-foreground">Notes</p>
              <p className="text-sm whitespace-pre-wrap text-foreground">
                {p.notes}
              </p>
            </div>
          )}

          {p.items.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No medication saved for this prescription.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Medication</TableHead>
                  <TableHead>Dosage</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Instructions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {p.items.map((i) => (
                  <TableRow key={i.id || i.medicationName}>
                    <TableCell>
                      <span className="flex items-center gap-2 font-medium">
                        <Pill
                          aria-hidden
                          className="size-4 shrink-0 text-muted-foreground"
                        />
                        {i.medicationName}
                      </span>
                    </TableCell>
                    <TableCell>{i.dosage || "-"}</TableCell>
                    <TableCell>{i.frequency || "-"}</TableCell>
                    <TableCell>{i.duration || "-"}</TableCell>
                    <TableCell className="max-w-64 whitespace-normal">
                      {i.instructions || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </article>
      ))}
    </div>
  );
}
