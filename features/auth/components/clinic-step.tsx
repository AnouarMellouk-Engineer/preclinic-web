"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Globe, Loader2, MapPin, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";

import { registerClinicAction } from "../actions";
import { ROOT_DOMAIN } from "../constants";
import { clinicSchema, type ClinicValues, type OwnerValues } from "../schemas";
import { AuthCard } from "./auth-card";
import { FormError, FormField } from "./form-field";
import { IconInput } from "./icon-input";

export function ClinicStep({
  owner,
  defaultValues,
  onBack,
}: {
  owner: OwnerValues;
  defaultValues?: ClinicValues;
  onBack: (draft: ClinicValues) => void;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClinicValues>({
    resolver: zodResolver(clinicSchema),
    defaultValues: defaultValues ?? {
      name: "",
      subDomain: "",
      address: "",
      phone: "",
    },
  });

  const onSubmit = handleSubmit(async (clinic) => {
    setServerError(null);
    const result = await registerClinicAction({ owner, clinic });
    if (!result.ok) return setServerError(result.message);
    router.replace(result.redirectTo);
    router.refresh();
  });

  return (
    <AuthCard
      title="Clinic details"
      description="Tell us about your clinic to finish creating your account"
    >
      <form
        onSubmit={onSubmit}
        noValidate
        className="flex w-full flex-col gap-5"
      >
        <FormField
          label="Clinic Name"
          htmlFor="name"
          error={errors.name?.message}
        >
          <IconInput
            id="name"
            icon={Building2}
            placeholder="Enter Clinic Name"
            autoComplete="organization"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
        </FormField>

        <FormField
          label="Clinic Subdomain"
          htmlFor="subDomain"
          error={errors.subDomain?.message}
        >
          <IconInput
            id="subDomain"
            icon={Globe}
            placeholder="el-amel"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            aria-invalid={!!errors.subDomain}
            className="pr-[120px]"
            rightSlot={
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-grey-500">
                .{ROOT_DOMAIN}
              </span>
            }
            {...register("subDomain")}
          />
        </FormField>

        <FormField
          label="Address"
          htmlFor="address"
          error={errors.address?.message}
        >
          <IconInput
            id="address"
            icon={MapPin}
            placeholder="Enter Clinic Address"
            autoComplete="street-address"
            aria-invalid={!!errors.address}
            {...register("address")}
          />
        </FormField>

        <FormField
          label="Your Phone Number"
          htmlFor="phone"
          error={errors.phone?.message}
        >
          <IconInput
            id="phone"
            type="tel"
            icon={Phone}
            placeholder="+213 550 00 00 00"
            autoComplete="tel"
            aria-invalid={!!errors.phone}
            {...register("phone")}
          />
        </FormField>

        <FormError message={serverError} />

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            className="h-[38px] flex-1"
            onClick={() => onBack(getValues())}
          >
            Back
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-[38px] flex-1"
          >
            {isSubmitting && <Loader2 className="animate-spin" />}
            Create account
          </Button>
        </div>
      </form>
    </AuthCard>
  );
}
