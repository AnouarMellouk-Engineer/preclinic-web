import { apiFetch } from "@/lib/api/client";

import type { AppointmentStatus, WaitingStatus } from "./constants";

export const receptionApi = {
  /** GET /reception/appointments */
  listAppointments: (
    token: string,
    query: { status?: string; doctorId?: string; date?: string },
  ) =>
    apiFetch<unknown>("/reception/appointments", {
      token,
      query: { ...query, page: 1, limit: 100 },
    }),

  /** PATCH /reception/appointments/:id/status (cancellationReason required for CANCELLED) */
  changeStatus: (
    token: string,
    id: string,
    body: { status: AppointmentStatus; cancellationReason?: string },
  ) =>
    apiFetch<unknown>(`/reception/appointments/${id}/status`, {
      method: "PATCH",
      body,
      token,
    }),

  /** POST /appointments. BACKEND GAP: the DTO has no patientId (see notes). */
  // book: (
  //   token: string,
  //   body: {
  //     patientId: string;
  //     doctorId: string;
  //     startAt: string;
  //     reason?: string;
  //   },
  // ) => apiFetch<unknown>("/appointments", { method: "POST", body, token }),
  /** POST /appointments/receptionist: books AND confirms for the patient (by email). */
  book: (
    token: string,
    body: {
      patientEmail: string;
      doctorId: string;
      startAt: string;
      reason?: string;
    },
  ) =>
    apiFetch<unknown>("/appointments/receptionist", {
      method: "POST",
      body,
      token,
    }),

  /** GET /doctors/:id/slots?date=YYYY-MM-DD */
  slots: (token: string, doctorId: string, date: string) =>
    apiFetch<unknown>(`/doctors/${doctorId}/slots`, { token, query: { date } }),

  /** GET /waiting-room */
  listWaitingRoom: (
    token: string,
    query: { doctorId?: string; status?: WaitingStatus },
  ) => apiFetch<unknown>("/waiting-room", { token, query }),

  /** POST /waiting-room/check-in */
  checkIn: (token: string, appointmentId: string) =>
    apiFetch<unknown>("/waiting-room/check-in", {
      method: "POST",
      body: { appointmentId },
      token,
    }),
};
