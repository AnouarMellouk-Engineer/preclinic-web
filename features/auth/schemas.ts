import { z } from "zod";

const email = z.email("Enter a valid email address");
const password = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be at most 72 characters");

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"),
  remember: z.boolean(),
});
export type LoginValues = z.infer<typeof loginSchema>;

// Step 1 of the register flow = the Figma "Register" frame.
export const ownerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, "Full name is required")
      .max(200)
      .refine(
        (v) => v.split(/\s+/).length >= 2,
        "Enter your first and last name",
      ),
    email,
    password,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    acceptTerms: z
      .boolean()
      .refine((v) => v, "You must accept the terms to continue"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
export type OwnerValues = z.infer<typeof ownerSchema>;

// Step 2: the clinic fields the API requires but the Figma frame doesn't have.
export const clinicSchema = z.object({
  name: z.string().trim().min(2, "Clinic name is required").max(150),
  subDomain: z
    .string()
    .trim()
    .min(2, "Subdomain is required")
    .max(100)
    .regex(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      "Lowercase letters, digits and single hyphens only",
    ),
  address: z.string().trim().min(5, "Address is required"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9 ]{8,20}$/, "Enter a valid phone number"),
});
export type ClinicValues = z.infer<typeof clinicSchema>;

export const registerClinicSchema = z.object({
  owner: ownerSchema,
  clinic: clinicSchema,
});
export type RegisterClinicValues = z.infer<typeof registerClinicSchema>;
