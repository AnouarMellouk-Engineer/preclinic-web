import "server-only";

import { apiFetch } from "@/lib/api/client";

import type {
  AuthResponse,
  LoginPayload,
  RegisterClinicPayload,
  SetPasswordPayload,
} from "./types";

export const authApi = {
  /** POST /auth/login -> 200 { accessToken } */
  login: (body: LoginPayload) =>
    apiFetch<AuthResponse>("/auth/login", { method: "POST", body }),

  /** POST /register/clinic -> 201 { accessToken } (owner token) */
  registerClinic: (body: RegisterClinicPayload) =>
    apiFetch<AuthResponse>("/register/clinic", { method: "POST", body }),

  /**
   * POST /register/setpassword -> 200. The docs don't say what the body contains;
   * if the backend returns { accessToken } we sign the user straight in.
   */
  setPassword: (body: SetPasswordPayload) =>
    apiFetch<Partial<AuthResponse> | null>("/register/setpassword", {
      method: "POST",
      body,
    }),
};
