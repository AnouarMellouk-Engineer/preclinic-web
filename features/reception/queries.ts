import "server-only";

import { ApiError } from "@/lib/api/client";
import { staffApi } from "@/features/owner/api";

import { receptionApi } from "./api";
import {
  APPOINTMENT_STATUSES,
  WAITING_STATUSES,
  type AppointmentStatus,
  type WaitingStatus,
} from "./constants";
import { requireReceptionist } from "./guards";
import type {
  Appointment,
  DoctorOption,
  Person,
  Slot,
  WaitingEntry,
} from "./types";

export type QueryResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string };

/* Response schemas of these endpoints are not documented: tolerant normalisation,
 * same approach as the owner queries. Adjust the mappers once the real shapes are known. */
type Raw = Record<string, unknown>;
const isObj = (v: unknown): v is Raw => typeof v === "object" && v !== null;
const str = (v: unknown) => (typeof v === "string" ? v : undefined);

export function extractList(raw: unknown): Raw[] {
  if (Array.isArray(raw)) return raw.filter(isObj);
  if (isObj(raw)) {
    for (const key of ["data", "items", "results"]) {
      const value = raw[key];
      if (Array.isArray(value)) return value.filter(isObj);
    }
  }
  return [];
}

/** Accepts a User, or a membership/profile wrapping a `user` / `patient`. */
function toPerson(raw: unknown): Person {
  const r = isObj(raw) ? raw : {};
  const u = isObj(r.user) ? r.user : isObj(r.patient) ? r.patient : r;
  return {
    firstName: str(u.firstName) ?? "",
    lastName: str(u.lastName) ?? "",
    phone: str(u.phone) ?? "",
  };
}

function toAppointment(raw: Raw): Appointment {
  const status = str(raw.status);
  const doctor = isObj(raw.doctor) ? raw.doctor : {};
  return {
    id: str(raw.id) ?? "",
    startAt: str(raw.startAt) ?? "",
    status: APPOINTMENT_STATUSES.includes(status as AppointmentStatus)
      ? (status as AppointmentStatus)
      : "PENDING",
    reason: str(raw.reason) ?? null,
    patient: toPerson(raw.patient),
    doctor: { ...toPerson(doctor), specialist: str(doctor.specialist) ?? null },
  };
}

function toWaitingEntry(raw: Raw): WaitingEntry {
  const status = str(raw.status);
  const appt = isObj(raw.appointment) ? raw.appointment : {};
  return {
    id: str(raw.id) ?? "",
    status: WAITING_STATUSES.includes(status as WaitingStatus)
      ? (status as WaitingStatus)
      : "WAITING",
    since: str(raw.checkedInAt) ?? str(raw.createdAt) ?? "",
    patient: toPerson(raw.patient ?? appt.patient),
    doctor: toPerson(raw.doctor ?? appt.doctor),
  };
}

function fail(
  error: unknown,
  fallback: string,
): { ok: false; message: string } {
  if (error instanceof ApiError && error.status < 500) {
    return { ok: false, message: error.messages[0] ?? error.message };
  }
  return { ok: false, message: fallback };
}

export async function getAppointments(filters: {
  status?: string;
  doctorId?: string;
  date?: string;
}): Promise<QueryResult<Appointment[]>> {
  const { token } = await requireReceptionist();
  try {
    const raw = await receptionApi.listAppointments(token, filters);
    return { ok: true, data: extractList(raw).map(toAppointment) };
  } catch (e) {
    return fail(e, "Couldn't load bookings. Please try again.");
  }
}

export async function getWaitingRoom(filters: {
  doctorId?: string;
  status?: WaitingStatus;
}): Promise<QueryResult<WaitingEntry[]>> {
  const { token } = await requireReceptionist();
  try {
    const raw = await receptionApi.listWaitingRoom(token, filters);
    return { ok: true, data: extractList(raw).map(toWaitingEntry) };
  } catch (e) {
    return fail(e, "Couldn't load the waiting room. Please try again.");
  }
}

/** Id = the doctor's membership id (what POST /appointments expects). */
export async function getDoctorOptions(): Promise<DoctorOption[]> {
  const { token, user } = await requireReceptionist();
  try {
    const raw = await staffApi.listDoctors(token, user.clinicId);
    return extractList(raw).map((r) => {
      const p = toPerson(r);
      return {
        id: str(r.id) ?? "",
        name: `Dr. ${p.firstName} ${p.lastName}`.trim(),
      };
    });
  } catch {
    return [];
  }
}

export async function fetchSlots(
  doctorId: string,
  date: string,
): Promise<Slot[]> {
  const { token } = await requireReceptionist();
  const raw = await receptionApi.slots(token, doctorId, date);
  const list: unknown[] = Array.isArray(raw)
    ? raw
    : isObj(raw) && Array.isArray(raw.slots)
      ? raw.slots
      : extractList(raw);
  return list
    .map((s) =>
      typeof s === "string"
        ? s
        : isObj(s)
          ? (str(s.startAt) ?? str(s.start))
          : undefined,
    )
    .filter((v): v is string => Boolean(v))
    .map((value) => ({
      value,
      label: new Date(value).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Africa/Algiers",
      }),
    }));
}
