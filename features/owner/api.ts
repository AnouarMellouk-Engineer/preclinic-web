import "server-only";

import { apiFetch } from "@/lib/api/client";

import type { InviteStaffPayload } from "./types";

export const staffApi = {
  /** POST /register/staff (owner only) -> 201, activation token issued */
  inviteStaff: (token: string, body: InviteStaffPayload) =>
    apiFetch<unknown>("/register/staff", { method: "POST", body, token }),

  /** GET /doctors?clinicId&page&limit -> 200 (response schema is not documented) */
  listDoctors: (token: string, clinicId?: string) =>
    apiFetch<unknown>("/doctors", {
      token,
      query: { clinicId, page: 1, limit: 100 },
    }),
};
