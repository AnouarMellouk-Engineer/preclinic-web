import { z } from "zod";

export const bookingFormSchema = z.object({
  patientEmail: z
    .string()
    .trim()
    .min(1, "Patient email is required")
    .max(255)
    .email("Enter a valid email"),
  doctorId: z.string().min(1, "Select a doctor"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Select a date"),
  startAt: z.string().min(1, "Select a time slot"),
  reason: z.string().trim().max(500),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
