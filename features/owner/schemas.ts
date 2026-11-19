import { z } from "zod";

import { SPECIALISTS, type Specialist } from "./constants";

const PRICE = /^\d+(\.\d{1,2})?$/;

/**
 * One flat shape for both roles so a single RHF form type works.
 * Doctor-only rules are enforced when `role === "DOCTOR"`.
 */
export const inviteFormSchema = (role: "DOCTOR" | "RECEPTIONIST") =>
  z
    .object({
      firstName: z.string().trim().min(1, "First name is required").max(100),
      lastName: z.string().trim().min(1, "Last name is required").max(100),
      email: z.email("Enter a valid email address"),
      phone: z
        .string()
        .trim()
        .regex(/^\+?[0-9 ]{8,20}$/, "Enter a valid phone number"),
      specialist: z.string(),
      pricingPerConsultation: z.string().trim(),
    })
    .superRefine((v, ctx) => {
      if (role !== "DOCTOR") return;
      if (!SPECIALISTS.includes(v.specialist as Specialist)) {
        ctx.addIssue({
          code: "custom",
          path: ["specialist"],
          message: "Select a specialty",
        });
      }
      if (v.pricingPerConsultation && !PRICE.test(v.pricingPerConsultation)) {
        ctx.addIssue({
          code: "custom",
          path: ["pricingPerConsultation"],
          message: "Enter an amount like 3000 or 3000.50",
        });
      }
    });

export type InviteFormValues = z.infer<ReturnType<typeof inviteFormSchema>>;
