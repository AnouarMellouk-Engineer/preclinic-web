"use client";

import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   CalendarDays,
//   Clock,
//   Loader2,
//   Plus,
//   Stethoscope,
//   User,
//   Mail,
// } from "lucide-react";

import {
  CalendarDays,
  Clock,
  Loader2,
  Mail,
  MessageSquare,
  Plus,
  Stethoscope,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormError, FormField } from "@/features/auth/components/form-field";
import { IconInput } from "@/features/auth/components/icon-input";
import { NativeSelect } from "@/features/owner/components/native-select";

import { createBookingAction, getSlotsAction } from "../actions";
import { bookingFormSchema, type BookingFormValues } from "../schemas";
import type { DoctorOption, Slot } from "../types";

export function CreateBookingDialog({ doctors }: { doctors: DoctorOption[] }) {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      patientEmail: "",
      doctorId: "",
      date: "",
      startAt: "",
      reason: "",
    },
  });

  const doctorId = watch("doctorId");
  const date = watch("date");

  useEffect(() => {
    setValue("startAt", "");
    setSlots([]);
    if (!doctorId || !date) return;
    let cancelled = false;
    setLoadingSlots(true);
    getSlotsAction(doctorId, date).then((s) => {
      if (cancelled) return;
      setSlots(s);
      setLoadingSlots(false);
    });
    return () => {
      cancelled = true;
    };
  }, [doctorId, date, setValue]);

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    const result = await createBookingAction(values);
    if (!result.ok) return setServerError(result.message);
    toast.success("Booking created.");
    setOpen(false);
    reset();
  });

  return (
    <>
      <Button
        type="button"
        className="h-10 gap-2 px-4"
        onClick={() => setOpen(true)}
      >
        <Plus aria-hidden />
        New booking
      </Button>

      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) {
            reset();
            setServerError(null);
          }
        }}
      >
        <DialogContent>
          <div className="mb-5 flex flex-col gap-1 pr-6">
            <DialogTitle>New booking</DialogTitle>
            <DialogDescription>
              Pick a doctor, a day and one of the available slots.
            </DialogDescription>
          </div>

          <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
            {/* <FormField
              label="Patient ID"
              htmlFor="patientId"
              error={errors.patientId?.message}
            >
              <IconInput
                id="patientId"
                icon={User}
                placeholder="Patient UUID"
                autoComplete="off"
                aria-invalid={!!errors.patientId}
                {...register("patientId")}
              />
            </FormField> */}

            <FormField
              label="Patient email"
              htmlFor="patientEmail"
              error={errors.patientEmail?.message}
            >
              <IconInput
                id="patientEmail"
                type="email"
                icon={Mail}
                placeholder="patient@mail.com"
                autoComplete="off"
                aria-invalid={!!errors.patientEmail}
                {...register("patientEmail")}
              />
            </FormField>

            <FormField
              label="Doctor"
              htmlFor="doctorId"
              error={errors.doctorId?.message}
            >
              <NativeSelect
                id="doctorId"
                icon={Stethoscope}
                aria-invalid={!!errors.doctorId}
                {...register("doctorId")}
              >
                <option value="">Select a doctor</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </NativeSelect>
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="Date"
                htmlFor="date"
                error={errors.date?.message}
              >
                <IconInput
                  id="date"
                  type="date"
                  icon={CalendarDays}
                  aria-invalid={!!errors.date}
                  {...register("date")}
                />
              </FormField>
              <FormField
                label="Time slot"
                htmlFor="startAt"
                error={errors.startAt?.message}
              >
                <NativeSelect
                  id="startAt"
                  icon={Clock}
                  disabled={!doctorId || !date || loadingSlots}
                  aria-invalid={!!errors.startAt}
                  {...register("startAt")}
                >
                  <option value="">
                    {loadingSlots
                      ? "Loading..."
                      : slots.length || !doctorId || !date
                        ? "Select a slot"
                        : "No slot available"}
                  </option>
                  {slots.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </NativeSelect>
              </FormField>
            </div>
            {/* 
            <FormField
              label="Reason (optional)"
              htmlFor="reason"
              error={errors.reason?.message}
            >
              <IconInput
                id="reason"
                placeholder="Consultation reason"
                autoComplete="off"
                {...register("reason")}
              />
            </FormField> */}
            <FormField
              label="Reason (optional)"
              htmlFor="reason"
              error={errors.reason?.message}
            >
              <IconInput
                id="reason"
                icon={MessageSquare}
                placeholder="Consultation reason"
                autoComplete="off"
                {...register("reason")}
              />
            </FormField>

            <FormError message={serverError} />

            <div className="mt-1 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                className="h-[38px] px-4"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-[38px] px-4"
              >
                {isSubmitting && <Loader2 className="animate-spin" />}
                Create booking
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
