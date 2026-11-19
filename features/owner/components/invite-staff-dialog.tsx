"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Banknote, Loader2, Mail, Phone, Plus, Stethoscope, User } from "lucide-react";
import { useMemo, useState } from "react";
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

import { inviteStaffAction } from "../actions";
import { SPECIALIST_OPTIONS } from "../constants";
import { inviteFormSchema, type InviteFormValues } from "../schemas";
import type { StaffRole } from "../types";
import { NativeSelect } from "./native-select";

const COPY = {
  DOCTOR: { button: "Invite doctor", title: "Invite a doctor", noun: "doctor" },
  RECEPTIONIST: { button: "Invite receptionist", title: "Invite a receptionist", noun: "receptionist" },
} as const;

export function InviteStaffDialog({ role }: { role: StaffRole }) {
  const copy = COPY[role];
  const isDoctor = role === "DOCTOR";
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const schema = useMemo(() => inviteFormSchema(role), [role]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      specialist: "",
      pricingPerConsultation: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    const result = await inviteStaffAction({ role, values });
    if (!result.ok) return setServerError(result.message);
    toast.success(`Invitation created for ${values.firstName} ${values.lastName}.`);
    setOpen(false);
    reset();
  });

  return (
    <>
      <Button type="button" className="h-10 gap-2 px-4" onClick={() => setOpen(true)}>
        <Plus aria-hidden />
        {copy.button}
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
            <DialogTitle>{copy.title}</DialogTitle>
            <DialogDescription>
              An activation token is issued so the {copy.noun} can set their own password.
            </DialogDescription>
          </div>

          <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="First name" htmlFor="firstName" error={errors.firstName?.message}>
                <IconInput
                  id="firstName"
                  icon={User}
                  placeholder="Amine"
                  autoComplete="off"
                  aria-invalid={!!errors.firstName}
                  {...register("firstName")}
                />
              </FormField>
              <FormField label="Last name" htmlFor="lastName" error={errors.lastName?.message}>
                <IconInput
                  id="lastName"
                  icon={User}
                  placeholder="Zerrouki"
                  autoComplete="off"
                  aria-invalid={!!errors.lastName}
                  {...register("lastName")}
                />
              </FormField>
            </div>

            <FormField label="Email address" htmlFor="staffEmail" error={errors.email?.message}>
              <IconInput
                id="staffEmail"
                type="email"
                icon={Mail}
                placeholder="name@clinic.dz"
                autoComplete="off"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
            </FormField>

            <FormField label="Phone number" htmlFor="staffPhone" error={errors.phone?.message}>
              <IconInput
                id="staffPhone"
                type="tel"
                icon={Phone}
                placeholder="+213 550 00 00 00"
                autoComplete="off"
                aria-invalid={!!errors.phone}
                {...register("phone")}
              />
            </FormField>

            {isDoctor && (
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Specialty" htmlFor="specialist" error={errors.specialist?.message}>
                  <NativeSelect
                    id="specialist"
                    icon={Stethoscope}
                    className="h-8"
                    aria-invalid={!!errors.specialist}
                    {...register("specialist")}
                  >
                    <option value="">Select a specialty</option>
                    {SPECIALIST_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </NativeSelect>
                </FormField>
                <FormField
                  label="Consultation fee (DZD)"
                  htmlFor="pricing"
                  error={errors.pricingPerConsultation?.message}
                >
                  <IconInput
                    id="pricing"
                    inputMode="decimal"
                    icon={Banknote}
                    placeholder="3000"
                    autoComplete="off"
                    aria-invalid={!!errors.pricingPerConsultation}
                    {...register("pricingPerConsultation")}
                  />
                </FormField>
              </div>
            )}

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
              <Button type="submit" disabled={isSubmitting} className="h-[38px] px-4">
                {isSubmitting && <Loader2 className="animate-spin" />}
                Send invitation
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
