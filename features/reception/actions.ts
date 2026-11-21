"use server";

import { revalidatePath } from "next/cache";

import { ApiError } from "@/lib/api/client";

import { receptionApi } from "./api";
import { RECEPTION_ROUTES, type AppointmentStatus } from "./constants";
import { requireReceptionist } from "./guards";
import { fetchSlots } from "./queries";
import { bookingFormSchema, type BookingFormValues } from "./schemas";
import type { Slot } from "./types";

export type ActionResult = { ok: true } | { ok: false; message: string };
const GENERIC = "Something went wrong. Please try again.";

function toResult(error: unknown): ActionResult {
  if (error instanceof ApiError) {
    if (error.status >= 500) return { ok: false, message: GENERIC };
    if (error.status === 401)
      return { ok: false, message: "Your session expired. Sign in again." };
    if (error.status === 403)
      return { ok: false, message: "You are not allowed to do this." };
    return { ok: false, message: error.messages[0] ?? GENERIC };
  }
  return {
    ok: false,
    message: "Can't reach the server. Please check your connection.",
  };
}

// export async function createBookingAction(
//   values: BookingFormValues,
// ): Promise<ActionResult> {
//   const { token } = await requireReceptionist();
//   const parsed = bookingFormSchema.safeParse(values);
//   if (!parsed.success)
//     return { ok: false, message: "Please check the form and try again." };
//   const v = parsed.data;
//   try {
//     await receptionApi.book(token, {
//       patientId: v.patientId,
//       doctorId: v.doctorId,
//       startAt: v.startAt,
//       ...(v.reason && { reason: v.reason }),
//     });
//   } catch (e) {
//     return toResult(e);
//   }
//   revalidatePath(RECEPTION_ROUTES.bookings);
//   return { ok: true };
// }

export async function createBookingAction(
  values: BookingFormValues,
): Promise<ActionResult> {
  const { token } = await requireReceptionist();
  const parsed = bookingFormSchema.safeParse(values);
  if (!parsed.success)
    return { ok: false, message: "Please check the form and try again." };
  const v = parsed.data;
  try {
    await receptionApi.book(token, {
      patientEmail: v.patientEmail.toLowerCase(),
      doctorId: v.doctorId,
      startAt: v.startAt,
      ...(v.reason && { reason: v.reason }),
    });
  } catch (e) {
    return toResult(e);
  }
  revalidatePath(RECEPTION_ROUTES.bookings);
  return { ok: true };
}

export async function changeStatusAction(input: {
  id: string;
  status: AppointmentStatus;
  cancellationReason?: string;
}): Promise<ActionResult> {
  const { token } = await requireReceptionist();
  if (
    input.status === "CANCELLED" &&
    (input.cancellationReason?.trim().length ?? 0) < 3
  ) {
    return {
      ok: false,
      message: "A cancellation reason is required (min. 3 characters).",
    };
  }
  try {
    await receptionApi.changeStatus(token, input.id, {
      status: input.status,
      ...(input.status === "CANCELLED" && {
        cancellationReason: input.cancellationReason!.trim(),
      }),
    });
  } catch (e) {
    return toResult(e);
  }
  revalidatePath(RECEPTION_ROUTES.bookings);
  revalidatePath(RECEPTION_ROUTES.waitingRoom);
  return { ok: true };
}

export async function checkInAction(
  appointmentId: string,
): Promise<ActionResult> {
  const { token } = await requireReceptionist();
  try {
    await receptionApi.checkIn(token, appointmentId);
  } catch (e) {
    return toResult(e);
  }
  revalidatePath(RECEPTION_ROUTES.bookings);
  revalidatePath(RECEPTION_ROUTES.waitingRoom);
  return { ok: true };
}

export async function getSlotsAction(
  doctorId: string,
  date: string,
): Promise<Slot[]> {
  try {
    return await fetchSlots(doctorId, date);
  } catch {
    return [];
  }
}
