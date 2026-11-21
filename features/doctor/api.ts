import "server-only";

import { apiFetch } from "@/lib/api/client";

import type { PrescriptionFormValues } from "./schemas";
import type { WaitingStatus } from "./types";

const enc = encodeURIComponent;
const PAGE = { page: 1, limit: 100 };

export const doctorApi = {
  /** GET /reception/appointments (filter: doctorId, status, date, week) */
  appointments: (token: string, query: Record<string, string | undefined>) =>
    apiFetch<unknown>("/reception/appointments", {
      token,
      query: { ...query, ...PAGE },
    }),

  /** GET /waiting-room: a doctor always gets their own queue */
  waitingRoom: (token: string, status?: WaitingStatus) =>
    apiFetch<unknown>("/waiting-room", { token, query: { status } }),

  /** PATCH /waiting-room/:id/status (WAITING -> IN_CONSULTATION -> COMPLETED) */
  setWaitingStatus: (
    token: string,
    id: string,
    status: "IN_CONSULTATION" | "COMPLETED",
  ) =>
    apiFetch<unknown>(`/waiting-room/${enc(id)}/status`, {
      method: "PATCH",
      token,
      body: { status },
    }),

  /** GET /patients?search */
  patients: (token: string, search?: string) =>
    apiFetch<unknown>("/patients", { token, query: { search, ...PAGE } }),

  /** GET /patients/:id (profile + my previous consultations) */
  patient: (token: string, id: string) =>
    apiFetch<unknown>(`/patients/${enc(id)}`, { token }),

  /** GET /consultations?patientName&date&week */
  consultations: (token: string, query: Record<string, string | undefined>) =>
    apiFetch<unknown>("/consultations", {
      token,
      query: { ...query, ...PAGE },
    }),

  /** GET /consultations/:id */
  consultation: (token: string, id: string) =>
    apiFetch<unknown>(`/consultations/${enc(id)}`, { token }),

  /** PATCH /consultations/:id */
  updateConsultation: (
    token: string,
    id: string,
    body: {
      observation: string;
      diagnosis: string;
      isSharedWithPatient: boolean;
    },
  ) =>
    apiFetch<unknown>(`/consultations/${enc(id)}`, {
      method: "PATCH",
      token,
      body,
    }),

  /** POST /consultations/:id/private-notes */
  addNote: (token: string, id: string, content: string) =>
    apiFetch<unknown>(`/consultations/${enc(id)}/private-notes`, {
      method: "POST",
      token,
      body: { content },
    }),

  /** POST /consultations/:id/prescriptions */
  createPrescription: (
    token: string,
    id: string,
    body: PrescriptionFormValues,
  ) =>
    apiFetch<unknown>(`/consultations/${enc(id)}/prescriptions`, {
      method: "POST",
      token,
      body: {
        ...(body.notes && { notes: body.notes }),
        items: body.items.map((i) => ({
          ...i,
          instructions: i.instructions || undefined,
        })),
      },
    }),
};
