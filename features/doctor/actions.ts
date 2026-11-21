"use server";

import { revalidatePath } from "next/cache";

import { getSession } from "@/features/auth/session";
import { ApiError } from "@/lib/api/client";

import { doctorApi } from "./api";
import { DOCTOR_ROUTES } from "./constants";
import {
  consultationSchema,
  noteSchema,
  prescriptionSchema,
  type ConsultationFormValues,
  type NoteFormValues,
  type PrescriptionFormValues,
} from "./schemas";

export type DoctorActionResult = { ok: true } | { ok: false; message: string };

const GENERIC = "Something went wrong. Please try again.";

/** Server actions are public POST endpoints: re-check the role here, never trust the UI. */
async function doctorSession() {
  const session = await getSession();
  return session && session.user.role === "DOCTOR" ? session : null;
}

function fail(error: unknown): DoctorActionResult {
  if (error instanceof ApiError) {
    if (error.status >= 500) return { ok: false, message: GENERIC };
    if (error.status === 401)
      return { ok: false, message: "Your session expired. Sign in again." };
    if (error.status === 403)
      return { ok: false, message: "You can't do this with your account." };
    return { ok: false, message: error.messages[0] ?? GENERIC };
  }
  return {
    ok: false,
    message:
      "Can't reach the server. Please check your connection and try again.",
  };
}

const DENIED: DoctorActionResult = {
  ok: false,
  message: "Only doctors can do this.",
};
const INVALID: DoctorActionResult = {
  ok: false,
  message: "Please check the form and try again.",
};

export async function updateConsultationAction(
  id: string,
  input: ConsultationFormValues,
): Promise<DoctorActionResult> {
  const session = await doctorSession();
  if (!session) return DENIED;
  const parsed = consultationSchema.safeParse(input);
  if (!parsed.success) return INVALID;
  try {
    await doctorApi.updateConsultation(session.token, id, parsed.data);
  } catch (error) {
    return fail(error);
  }
  revalidatePath(`${DOCTOR_ROUTES.consultations}/${id}`);
  revalidatePath(DOCTOR_ROUTES.consultations);
  return { ok: true };
}

export async function addPrivateNoteAction(
  id: string,
  input: NoteFormValues,
): Promise<DoctorActionResult> {
  const session = await doctorSession();
  if (!session) return DENIED;
  const parsed = noteSchema.safeParse(input);
  if (!parsed.success) return INVALID;
  try {
    await doctorApi.addNote(session.token, id, parsed.data.content);
  } catch (error) {
    return fail(error);
  }
  revalidatePath(`${DOCTOR_ROUTES.consultations}/${id}`);
  return { ok: true };
}

export async function createPrescriptionAction(
  id: string,
  input: PrescriptionFormValues,
): Promise<DoctorActionResult> {
  const session = await doctorSession();
  if (!session) return DENIED;
  const parsed = prescriptionSchema.safeParse(input);
  if (!parsed.success) return INVALID;
  try {
    await doctorApi.createPrescription(session.token, id, parsed.data);
  } catch (error) {
    return fail(error);
  }
  revalidatePath(`${DOCTOR_ROUTES.consultations}/${id}`);
  return { ok: true };
}

export async function updateWaitingStatusAction(
  id: string,
  status: "IN_CONSULTATION" | "COMPLETED",
): Promise<DoctorActionResult> {
  const session = await doctorSession();
  if (!session) return DENIED;
  if (status !== "IN_CONSULTATION" && status !== "COMPLETED") return INVALID;
  try {
    await doctorApi.setWaitingStatus(session.token, id, status);
  } catch (error) {
    return fail(error);
  }
  revalidatePath(DOCTOR_ROUTES.dashboard);
  return { ok: true };
}
