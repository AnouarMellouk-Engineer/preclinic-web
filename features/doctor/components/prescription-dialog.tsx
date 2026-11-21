"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
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
import { Pill } from "lucide-react";

import { createPrescriptionAction } from "../actions";
import { TEXTAREA_CLASS } from "../constants";
import { prescriptionSchema, type PrescriptionFormValues } from "../schemas";

const EMPTY_ITEM = {
  medicationName: "",
  dosage: "",
  frequency: "",
  duration: "",
  instructions: "",
};

export function PrescriptionDialog({
  consultationId,
}: {
  consultationId: string;
}) {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PrescriptionFormValues>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: { notes: "", items: [EMPTY_ITEM] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    const result = await createPrescriptionAction(consultationId, values);
    if (!result.ok) return setServerError(result.message);
    toast.success("Prescription created.");
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
        New prescription
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
        <DialogContent className="max-w-2xl">
          <div className="mb-5 flex flex-col gap-1 pr-6">
            <DialogTitle>New prescription</DialogTitle>
            <DialogDescription>
              Add the medications prescribed during this consultation.
            </DialogDescription>
          </div>

          <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
            {fields.map((field, index) => {
              const e = errors.items?.[index];
              return (
                <div
                  key={field.id}
                  className="flex flex-col gap-3 rounded-[10px] border p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">
                      Medication {index + 1}
                    </p>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Remove medication ${index + 1}`}
                        onClick={() => remove(index)}
                      >
                        <Trash2 aria-hidden />
                      </Button>
                    )}
                  </div>
                  <FormField
                    label="Name"
                    htmlFor={`med-${index}`}
                    error={e?.medicationName?.message}
                  >
                    <IconInput
                      id={`med-${index}`}
                      icon={Pill}
                      placeholder="Paracetamol 500mg"
                      autoComplete="off"
                      aria-invalid={!!e?.medicationName}
                      {...register(`items.${index}.medicationName`)}
                    />
                  </FormField>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <FormField
                      label="Dosage"
                      htmlFor={`dos-${index}`}
                      error={e?.dosage?.message}
                    >
                      <IconInput
                        id={`dos-${index}`}
                        icon={Pill}
                        placeholder="1 tablet"
                        autoComplete="off"
                        aria-invalid={!!e?.dosage}
                        {...register(`items.${index}.dosage`)}
                      />
                    </FormField>
                    <FormField
                      label="Frequency"
                      htmlFor={`freq-${index}`}
                      error={e?.frequency?.message}
                    >
                      <IconInput
                        id={`freq-${index}`}
                        icon={Pill}
                        placeholder="3 times a day"
                        autoComplete="off"
                        aria-invalid={!!e?.frequency}
                        {...register(`items.${index}.frequency`)}
                      />
                    </FormField>
                    <FormField
                      label="Duration"
                      htmlFor={`dur-${index}`}
                      error={e?.duration?.message}
                    >
                      <IconInput
                        id={`dur-${index}`}
                        icon={Pill}
                        placeholder="7 days"
                        autoComplete="off"
                        aria-invalid={!!e?.duration}
                        {...register(`items.${index}.duration`)}
                      />
                    </FormField>
                  </div>
                  <FormField
                    label="Instructions (optional)"
                    htmlFor={`ins-${index}`}
                  >
                    <textarea
                      id={`ins-${index}`}
                      rows={2}
                      className={TEXTAREA_CLASS}
                      {...register(`items.${index}.instructions`)}
                    />
                  </FormField>
                </div>
              );
            })}

            {errors.items?.message && (
              <p role="alert" className="text-xs text-destructive">
                {errors.items.message}
              </p>
            )}

            <Button
              type="button"
              variant="outline"
              className="gap-2 self-start"
              onClick={() => append(EMPTY_ITEM)}
            >
              <Plus aria-hidden />
              Add medication
            </Button>

            <FormField label="Notes (optional)" htmlFor="rx-notes">
              <textarea
                id="rx-notes"
                rows={2}
                className={TEXTAREA_CLASS}
                {...register("notes")}
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
                Create prescription
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
