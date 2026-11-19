"use client";

import { useState } from "react";

import type { ClinicValues, OwnerValues } from "../schemas";
import { ClinicStep } from "./clinic-step";
import { OwnerStep } from "./owner-step";

/**
 * Two steps, two independent RHF forms (each with its own zod schema):
 *  1. owner account  -> the Figma "Register" frame
 *  2. clinic details -> fields required by POST /register/clinic
 */
export function RegisterForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [owner, setOwner] = useState<OwnerValues | undefined>();
  const [clinic, setClinic] = useState<ClinicValues | undefined>();

  if (step === 1 || !owner) {
    return (
      <OwnerStep
        defaultValues={owner}
        onNext={(values) => {
          setOwner(values);
          setStep(2);
        }}
      />
    );
  }

  return (
    <ClinicStep
      owner={owner}
      defaultValues={clinic}
      onBack={(draft) => {
        setClinic(draft);
        setStep(1);
      }}
    />
  );
}
