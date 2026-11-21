import "server-only";

import { requireDoctor } from "@/features/auth/guards";
import { ApiError } from "@/lib/api/client";

import { doctorApi } from "./api";
import { todayISO } from "./constants";
import {
  extractList,
  findClinicPatient,
  findPatient,
  isObj,
  personName,
  str,
  type Raw,
} from "./normalize";
import type {
  Booking,
  ConsultationDetail,
  ConsultationSummary,
  Patient,
  PatientProfile,
  WaitingEntry,
} from "./types";

export type QueryResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string };

async function run<T>(
  fn: () => Promise<T>,
  fallback: string,
): Promise<QueryResult<T>> {
  try {
    return { ok: true, data: await fn() };
  } catch (error) {
    if (error instanceof ApiError && error.status < 500) {
      return { ok: false, message: error.messages[0] ?? error.message };
    }
    return { ok: false, message: fallback };
  }
}

/* ---------- mappers ---------- */
// function toBooking(raw: Raw): Booking {
//   const patient = findPatient(raw);
//   return {
//     id: str(raw.id) ?? "",
//     startAt: str(raw.startAt) ?? "",
//     endAt: str(raw.endAt) ?? null,
//     status: str(raw.status) ?? "PENDING",
//     reason: str(raw.reason) ?? "",
//     patientId: str(patient?.id) ?? str(raw.patientId) ?? "",
//     patientName: personName(patient) || "Unknown patient",
//     patientPhone: str(patient?.phone) ?? "",
//   };
// }

function toBooking(raw: Raw): Booking {
  const patient = findPatient(raw);
  return {
    id: str(raw.id) ?? "",
    startAt: str(raw.startAt) ?? "",
    endAt: str(raw.endAt) ?? null,
    status: str(raw.status) ?? "PENDING",
    reason: str(raw.reason) ?? "",
    // clinicPatient id: this is what /patients/:id expects
    patientId:
      str(findClinicPatient(raw)?.id) ?? str(raw.clinicPatientId) ?? "",
    patientName: personName(patient) || "Unknown patient",
    patientPhone: str(patient?.phone) ?? "",
  };
}

function toWaiting(raw: Raw): WaitingEntry {
  const appointment = isObj(raw.appointment) ? raw.appointment : {};
  return {
    id: str(raw.id) ?? "",
    status: str(raw.status) ?? "WAITING",
    appointmentId: str(raw.appointmentId) ?? str(appointment.id) ?? "",
    patientName: personName(findPatient(raw)) || "Unknown patient",
    startAt: str(appointment.startAt) ?? "",
    checkedInAt: str(raw.checkedInAt) ?? str(raw.createdAt) ?? "",
  };
}

// function toPatient(raw: Raw): Patient {
//   const user = isObj(raw.patient) ? raw.patient : raw;
//   const profile = isObj(user.patientProfile)
//     ? user.patientProfile
//     : isObj(raw.patientProfile)
//       ? raw.patientProfile
//       : raw;
//   return {
//     id: str(user.id) ?? str(raw.patientId) ?? "",
//     firstName: str(user.firstName) ?? "",
//     lastName: str(user.lastName) ?? "",
//     email: str(user.email) ?? "",
//     phone: str(user.phone) ?? "",
//     gender: str(profile.gender) ?? "",
//     birthDay: str(profile.birthDay) ?? "",
//   };
// }

function toPatient(raw: Raw): Patient {
  // List item: flat. Profile response: { id, patient: {...}, profile: {...} }.
  const user = isObj(raw.patient) ? raw.patient : raw;
  const profile = isObj(raw.profile)
    ? raw.profile
    : isObj(user.patientProfile)
      ? user.patientProfile
      : raw;
  return {
    id: str(raw.id) ?? str(user.id) ?? "", // clinicPatient id in both cases
    firstName: str(user.firstName) ?? "",
    lastName: str(user.lastName) ?? "",
    email: str(user.email) ?? "",
    phone: str(user.phone) ?? "",
    gender: str(profile.gender) ?? "",
    birthDay: str(profile.birthDay) ?? "",
  };
}

// function toConsultation(raw: Raw): ConsultationSummary {
//   const appointment = isObj(raw.appointment) ? raw.appointment : {};
//   const patient = findPatient(raw);
//   return {
//     id: str(raw.id) ?? "",
//     date: str(appointment.startAt) ?? str(raw.createdAt) ?? "",
//     patientId: str(patient?.id) ?? str(appointment.patientId) ?? "",
//     patientName: personName(patient) || "Unknown patient",
//     diagnosis: str(raw.diagnosis) ?? "",
//     observation: str(raw.observation) ?? "",
//     isSharedWithPatient: raw.isSharedWithPatient === true,
//   };
// }

function toConsultation(raw: Raw): ConsultationSummary {
  const appointment = isObj(raw.appointment) ? raw.appointment : {};
  const patient = findPatient(raw);
  return {
    id: str(raw.id) ?? "",
    // /patients/:id returns `date`; the other endpoints use appointment.startAt
    date: str(raw.date) ?? str(appointment.startAt) ?? str(raw.createdAt) ?? "",
    patientId:
      str(findClinicPatient(raw)?.id) ?? str(appointment.clinicPatientId) ?? "",
    patientName: personName(patient) || "Unknown patient",
    diagnosis: str(raw.diagnosis) ?? "",
    observation: str(raw.observation) ?? "",
    isSharedWithPatient: raw.isSharedWithPatient === true,
  };
}

function toConsultationDetail(raw: Raw): ConsultationDetail {
  return {
    ...toConsultation(raw),
    privateNotes: extractList(raw.privateNotes).map((n) => ({
      id: str(n.id) ?? "",
      content: str(n.content) ?? "",
      createdAt: str(n.createdAt) ?? "",
    })),
    // prescriptions: extractList(raw.prescriptions).map((p) => ({
    //   id: str(p.id) ?? "",
    //   notes: str(p.notes) ?? "",
    //   issuedAt: str(p.issuedAt) ?? str(p.createdAt) ?? "",
    //   items: extractList(p.items).map((i) => ({
    //     id: str(i.id) ?? "",
    //     medicationName: str(i.medicationName) ?? "",
    //     dosage: str(i.dosage) ?? "",
    //     duration: str(i.duration) ?? "",
    //     frequency: str(i.frequency) ?? "",
    //     instructions: str(i.instructions) ?? "",
    //   })),
    // })),
    prescriptions: extractList(raw.prescriptions)
      .map((p) => ({
        id: str(p.id) ?? "",
        notes: str(p.notes) ?? "",
        issuedAt: str(p.issuedAt) ?? str(p.createdAt) ?? "",
        pdfUrl: str(p.pdfUrl) ?? "",
        items: extractList(p.items).map((i) => ({
          id: str(i.id) ?? "",
          medicationName: str(i.medicationName) ?? "",
          dosage: str(i.dosage) ?? "",
          duration: str(i.duration) ?? "",
          frequency: str(i.frequency) ?? "",
          instructions: str(i.instructions) ?? "",
        })),
      }))
      // newest first (the API returns oldest first)
      .sort((a, b) => b.issuedAt.localeCompare(a.issuedAt)),
  };
}

/* ---------- queries (each one re-checks the DOCTOR role) ---------- */
export async function getBookings(
  filters: {
    status?: string;
    range?: string;
  } = {},
): Promise<QueryResult<Booking[]>> {
  const { token, user } = await requireDoctor();
  const today = todayISO();
  return run(async () => {
    const raw = await doctorApi.appointments(token, {
      doctorId: user.membershipId,
      status: filters.status || undefined,
      date: filters.range === "today" ? today : undefined,
      week: filters.range === "week" ? today : undefined,
    });
    return extractList(raw)
      .map(toBooking)
      .sort((a, b) => a.startAt.localeCompare(b.startAt));
  }, "Couldn't load your bookings. Please try again.");
}

export async function getWaitingRoom(): Promise<QueryResult<WaitingEntry[]>> {
  const { token } = await requireDoctor();
  return run(async () => {
    const [waiting, inConsultation] = await Promise.all([
      doctorApi.waitingRoom(token, "WAITING"),
      doctorApi.waitingRoom(token, "IN_CONSULTATION"),
    ]);
    return [...extractList(inConsultation), ...extractList(waiting)].map(
      toWaiting,
    );
  }, "Couldn't load the waiting room. Please try again.");
}

export async function getPatients(
  search = "",
): Promise<QueryResult<Patient[]>> {
  const { token } = await requireDoctor();
  return run(
    async () =>
      extractList(await doctorApi.patients(token, search || undefined)).map(
        toPatient,
      ),
    "Couldn't load your patients. Please try again.",
  );
}

export async function getPatient(
  id: string,
): Promise<QueryResult<PatientProfile>> {
  const { token } = await requireDoctor();
  // return run(async () => {
  //   const raw = await doctorApi.patient(token, id);
  //   const obj = isObj(raw) ? raw : {};
  //   return {
  //     patient: toPatient(obj),
  //     consultations: extractList(obj.consultations).map(toConsultation),
  //   };
  // }, "Couldn't load this patient. Please try again.");
  return run(async () => {
    const raw = await doctorApi.patient(token, id);
    const obj = isObj(raw) ? raw : {};
    const patient = toPatient(obj);
    const name = `${patient.firstName} ${patient.lastName}`.trim();
    return {
      patient,
      consultations: extractList(obj.consultations).map((c) => ({
        ...toConsultation(c),
        patientId: patient.id,
        patientName: name || "Unknown patient",
      })),
    };
  }, "Couldn't load this patient. Please try again.");
}

export async function getConsultations(
  filters: {
    patientName?: string;
    range?: string;
  } = {},
): Promise<QueryResult<ConsultationSummary[]>> {
  const { token } = await requireDoctor();
  const today = todayISO();
  return run(async () => {
    const raw = await doctorApi.consultations(token, {
      patientName: filters.patientName || undefined,
      date: filters.range === "today" ? today : undefined,
      week: filters.range === "week" ? today : undefined,
    });
    return extractList(raw)
      .map(toConsultation)
      .sort((a, b) => b.date.localeCompare(a.date));
  }, "Couldn't load your consultations. Please try again.");
}

export async function getConsultation(
  id: string,
): Promise<QueryResult<ConsultationDetail>> {
  const { token } = await requireDoctor();
  return run(async () => {
    const raw = await doctorApi.consultation(token, id);
    return toConsultationDetail(isObj(raw) ? raw : {});
  }, "Couldn't load this consultation. Please try again.");
}
