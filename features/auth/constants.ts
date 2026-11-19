import type { Role } from "./token";

export const TOKEN_COOKIE = "access_token";
export const DEFAULT_TIMEZONE = "Africa/Algiers";
export const ROOT_DOMAIN =
  process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "preclinic.com";

/** Roles allowed on the web app. Patients use the mobile app. */
export const WEB_ROLES = [
  "CLINIC_OWNER",
  "DOCTOR",
  "RECEPTIONIST",
] as const satisfies readonly Role[];

/** Where each role lands after login. Split these later (/doctor, /reception, ...). */
export const HOME_BY_ROLE: Record<(typeof WEB_ROLES)[number], string> = {
  CLINIC_OWNER: "/owner/doctors",
  DOCTOR: "/dashboard",
  RECEPTIONIST: "/dashboard",
};
