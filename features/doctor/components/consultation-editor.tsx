"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FormError, FormField } from "@/features/auth/components/form-field";

import { updateConsultationAction } from "../actions";
import { TEXTAREA_CLASS } from "../constants";
import { consultationSchema, type ConsultationFormValues } from "../schemas";

export function ConsultationEditor({
  id,
  defaultValues,
}: {
  id: string;
  defaultValues: ConsultationFormValues;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationSchema),
    defaultValues,
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    const result = await updateConsultationAction(id, values);
    if (!result.ok) return setServerError(result.message);
    toast.success("Consultation saved.");
    reset(values);
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <FormField
        label="Observation"
        htmlFor="observation"
        error={errors.observation?.message}
      >
        <textarea
          id="observation"
          rows={5}
          placeholder="Clinical observation..."
          className={TEXTAREA_CLASS}
          {...register("observation")}
        />
      </FormField>

      <FormField
        label="Diagnosis"
        htmlFor="diagnosis"
        error={errors.diagnosis?.message}
      >
        <textarea
          id="diagnosis"
          rows={3}
          placeholder="Diagnosis..."
          className={TEXTAREA_CLASS}
          {...register("diagnosis")}
        />
      </FormField>

      <div className="flex items-center gap-2">
        <Controller
          control={control}
          name="isSharedWithPatient"
          render={({ field }) => (
            <Checkbox
              id="isSharedWithPatient"
              checked={field.value}
              onCheckedChange={(v) => field.onChange(v === true)}
            />
          )}
        />
        <Label
          htmlFor="isSharedWithPatient"
          className="text-sm font-normal text-muted-foreground"
        >
          Share observation and diagnosis with the patient
        </Label>
      </div>

      <FormError message={serverError} />

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="h-[38px] px-4"
        >
          {isSubmitting && <Loader2 className="animate-spin" />}
          Save changes
        </Button>
      </div>
    </form>
  );
}
