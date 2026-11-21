import { z } from "zod";

export const consultationSchema = z.object({
  observation: z.string().trim(),
  diagnosis: z.string().trim(),
  isSharedWithPatient: z.boolean(),
});
export type ConsultationFormValues = z.infer<typeof consultationSchema>;

export const noteSchema = z.object({
  content: z.string().trim().min(1, "Write a note first").max(10000),
});
export type NoteFormValues = z.infer<typeof noteSchema>;

export const prescriptionItemSchema = z.object({
  medicationName: z.string().trim().min(1, "Required").max(200),
  dosage: z.string().trim().min(1, "Required").max(150),
  frequency: z.string().trim().min(1, "Required").max(100),
  duration: z.string().trim().min(1, "Required").max(100),
  instructions: z.string().trim(),
});

export const prescriptionSchema = z.object({
  notes: z.string().trim(),
  items: z.array(prescriptionItemSchema).min(1, "Add at least one medication"),
});
export type PrescriptionFormValues = z.infer<typeof prescriptionSchema>;
