import type { Metadata } from "next";
import { ConciergeBell, Info } from "lucide-react";

import { FormError } from "@/features/auth/components/form-field";
import { EmptyState } from "@/features/owner/components/empty-state";
import { InviteStaffDialog } from "@/features/owner/components/invite-staff-dialog";
import { PageHeading } from "@/features/owner/components/page-heading";
import { ReceptionistsTable } from "@/features/owner/components/receptionists-table";
import { StatCard, StatGrid } from "@/features/owner/components/stat-card";
import { Surface } from "@/features/owner/components/surface";
import { TableToolbar } from "@/features/owner/components/table-toolbar";
import {
  getReceptionists,
  RECEPTIONISTS_LIST_SUPPORTED,
} from "@/features/owner/queries";

export const metadata: Metadata = { title: "Receptionists" };

type Props = { searchParams: Promise<{ q?: string }> };

export default async function ReceptionistsPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const result = await getReceptionists(); // re-checks CLINIC_OWNER

  const all = result.ok ? result.data : [];
  const needle = q.toLowerCase();
  const receptionists = all.filter(
    (r) =>
      !needle ||
      `${r.firstName} ${r.lastName} ${r.email} ${r.phone}`
        .toLowerCase()
        .includes(needle),
  );

  return (
    <>
      <PageHeading
        subtitle="Manage the receptionists of your clinic"
        title="Receptionists"
        action={<InviteStaffDialog role="RECEPTIONIST" />}
      />

      <StatGrid>
        <StatCard value={all.length} label="Total receptionists" />
        <StatCard value={all.filter((r) => r.isActive).length} label="Active" />
        <StatCard
          value={all.filter((r) => !r.isActive).length}
          label="Inactive"
        />
      </StatGrid>

      <Surface className="flex flex-col gap-6 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl leading-6 font-semibold tracking-[-0.6px] text-foreground">
            Clinic receptionists
          </h2>
          {RECEPTIONISTS_LIST_SUPPORTED && (
            <TableToolbar placeholder="Search a receptionist..." />
          )}
        </div>

        {!RECEPTIONISTS_LIST_SUPPORTED && (
          <div
            role="note"
            className="flex items-start gap-3 rounded-[10px] border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-foreground"
          >
            <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-warning" />
            <p>
              Invitations work, but the list can&apos;t be displayed yet: the
              API has no endpoint to list receptionists. It will appear here as
              soon as one is available.
            </p>
          </div>
        )}

        {!result.ok ? (
          <FormError message={result.message} />
        ) : receptionists.length === 0 ? (
          <EmptyState
            icon={ConciergeBell}
            title={
              q
                ? "No receptionist matches your search"
                : "No receptionists to show"
            }
            description="Invite a receptionist so they can manage appointments and the waiting room."
          />
        ) : (
          <ReceptionistsTable receptionists={receptionists} />
        )}
      </Surface>
    </>
  );
}
