"use server";

import { revalidatePath } from "next/cache";

import { getSession } from "@/features/auth/session";
import { ApiError } from "@/lib/api/client";

import { staffApi } from "./api";
import { OWNER_ROUTES, type Specialist } from "./constants";
import { inviteFormSchema, type InviteFormValues } from "./schemas";
import type { InviteStaffPayload, StaffRole } from "./types";

export type InviteResult = { ok: true } | { ok: false; message: string };

const GENERIC = "Something went wrong. Please try again.";

/** Server actions are public POST endpoints: re-check the role here, never trust the UI. */
export async function inviteStaffAction(input: {
  role: StaffRole;
  values: InviteFormValues;
}): Promise<InviteResult> {
  const session = await getSession();
  if (!session || session.user.role !== "CLINIC_OWNER") {
    return { ok: false, message: "Only the clinic owner can invite staff." };
  }

  const role: StaffRole = input.role === "DOCTOR" ? "DOCTOR" : "RECEPTIONIST";
  const parsed = inviteFormSchema(role).safeParse(input.values);
  if (!parsed.success) {
    return { ok: false, message: "Please check the form and try again." };
  }
  const v = parsed.data;

  const payload: InviteStaffPayload = {
    role,
    firstName: v.firstName,
    lastName: v.lastName,
    email: v.email,
    phone: v.phone.replace(/\s+/g, ""),
    ...(role === "DOCTOR" && {
      specialist: v.specialist as Specialist,
      ...(v.pricingPerConsultation && {
        pricingPerConsultation: Number(v.pricingPerConsultation).toFixed(2),
      }),
    }),
  };

  try {
    await staffApi.inviteStaff(session.token, payload);
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status >= 500) return { ok: false, message: GENERIC };
      if (error.status === 401)
        return { ok: false, message: "Your session expired. Sign in again." };
      if (error.status === 403)
        return {
          ok: false,
          message: "Only the clinic owner can invite staff.",
        };
      if (error.status === 409)
        return {
          ok: false,
          message: "A user with this email or phone number already exists.",
        };
      return { ok: false, message: error.messages[0] ?? GENERIC };
    }
    return {
      ok: false,
      message:
        "Can't reach the server. Please check your connection and try again.",
    };
  }

  revalidatePath(
    role === "DOCTOR" ? OWNER_ROUTES.doctors : OWNER_ROUTES.receptionists,
  );
  return { ok: true };
}
