"use client";

import { Loader2, LogIn } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { changeStatusAction, checkInAction } from "../actions";
import {
  NEXT_STATUSES,
  formatStatus,
  type AppointmentStatus,
} from "../constants";

export function AppointmentActions({
  id,
  status,
}: {
  id: string;
  status: AppointmentStatus;
}) {
  const [pending, start] = useTransition();
  const next = NEXT_STATUSES[status];

  function run(
    fn: () => Promise<{ ok: boolean; message?: string }>,
    success: string,
  ) {
    start(async () => {
      const r = await fn();
      if (r.ok) toast.success(success);
      else toast.error(r.message ?? "Something went wrong.");
    });
  }

  function change(target: AppointmentStatus) {
    let cancellationReason: string | undefined;
    if (target === "CANCELLED") {
      const reason = window.prompt("Cancellation reason");
      if (reason === null) return;
      cancellationReason = reason;
    }
    run(
      () => changeStatusAction({ id, status: target, cancellationReason }),
      `Booking ${formatStatus(target).toLowerCase()}.`,
    );
  }

  if (next.length === 0)
    return <span className="text-muted-foreground">-</span>;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {pending && (
        <Loader2
          aria-hidden
          className="size-4 animate-spin text-muted-foreground"
        />
      )}
      {status === "CONFIRMED" && (
        <Button
          size="sm"
          variant="outline"
          disabled={pending}
          className="h-8 gap-1.5"
          onClick={() => run(() => checkInAction(id), "Patient checked in.")}
        >
          <LogIn aria-hidden />
          Check in
        </Button>
      )}
      {next.map((s) => (
        <Button
          key={s}
          size="sm"
          variant={s === "CANCELLED" ? "ghost" : "outline"}
          disabled={pending}
          className="h-8"
          onClick={() => change(s)}
        >
          {s === "CONFIRMED"
            ? "Confirm"
            : s === "COMPLETED"
              ? "Complete"
              : "Cancel"}
        </Button>
      ))}
    </div>
  );
}
