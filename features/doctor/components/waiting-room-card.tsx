"use client";

import { Loader2, Play, SquareCheck, Users } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/features/owner/components/status-badge";
import { EmptyState } from "@/features/owner/components/empty-state";

import { updateWaitingStatusAction } from "../actions";
import { formatTime } from "../constants";
import type { WaitingEntry } from "../types";

export function WaitingRoomList({ entries }: { entries: WaitingEntry[] }) {
  const [pending, startTransition] = useTransition();

  function move(id: string, status: "IN_CONSULTATION" | "COMPLETED") {
    startTransition(async () => {
      const result = await updateWaitingStatusAction(id, status);
      if (!result.ok) toast.error(result.message);
      else
        toast.success(
          status === "IN_CONSULTATION"
            ? "Consultation started."
            : "Consultation completed.",
        );
    });
  }

  if (entries.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="Nobody is waiting"
        description="Patients checked in by the reception will appear here."
      />
    );
  }

  return (
    <ul className="flex flex-col divide-y" aria-busy={pending}>
      {entries.map((e) => (
        <li
          key={e.id}
          className="flex flex-wrap items-center justify-between gap-3 py-3"
        >
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">
              {e.patientName}
            </span>
            <span className="text-xs text-muted-foreground">
              Appointment {formatTime(e.startAt)} · checked in{" "}
              {formatTime(e.checkedInAt)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge
              tone={e.status === "IN_CONSULTATION" ? "success" : "warning"}
            >
              {e.status === "IN_CONSULTATION" ? "in consultation" : "waiting"}
            </StatusBadge>
            {e.status === "WAITING" ? (
              <Button
                size="sm"
                className="gap-1.5"
                disabled={pending}
                onClick={() => move(e.id, "IN_CONSULTATION")}
              >
                {pending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Play aria-hidden />
                )}
                Start
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5"
                disabled={pending}
                onClick={() => move(e.id, "COMPLETED")}
              >
                {pending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <SquareCheck aria-hidden />
                )}
                Complete
              </Button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
