import "server-only";

import { apiFetch } from "@/lib/api/client";

import type {
  AuthResponse,
  LoginPayload,
  RegisterClinicPayload,
} from "./types";

export const authApi = {
  /** POST /auth/login -> 200 { accessToken } */
  login: (body: LoginPayload) =>
    apiFetch<AuthResponse>("/auth/login", { method: "POST", body }),

  /** POST /register/clinic -> 201 { accessToken } (owner token) */
  registerClinic: (body: RegisterClinicPayload) =>
    apiFetch<AuthResponse>("/register/clinic", { method: "POST", body }),
};
